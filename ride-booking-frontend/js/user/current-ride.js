/* =========================================
   CURRENT RIDE SCREEN

   Polls GET /users/{userId}/current, which
   only returns rides in BOOKED / ACCEPTED /
   STARTED. Once that 404s we check the ride
   history endpoint to tell a completed ride
   (-> go to payment) apart from a cancelled
   one (-> go home). There's no single
   "get ride by id" endpoint on the backend,
   so this history check is the reliable way
   to detect "ride finished" from the frontend.
========================================= */

const RIDE_STEPS = ["BOOKED", "ACCEPTED", "STARTED", "COMPLETED"];
const RIDE_STEP_LABELS = ["Requested", "Accepted", "On trip", "Completed"];
const DRIVER_SEARCH_TIMEOUT_SECONDS = 45;


function stopRidePolling() {

    if (window.__ridePollInterval) {
        clearInterval(window.__ridePollInterval);
        window.__ridePollInterval = null;
    }

    if (window.__etaTickInterval) {
        clearInterval(window.__etaTickInterval);
        window.__etaTickInterval = null;
    }

    if (window.__searchTimeoutInterval) {
        clearInterval(window.__searchTimeoutInterval);
        window.__searchTimeoutInterval = null;
    }
}


function renderCurrentRide() {

    const content = document.getElementById("content");

    if (!content) return;

    stopRidePolling();


    content.innerHTML = `
        <div class="current-ride-screen" id="currentRideContainer">
            <div id="rideMapSlot"></div>
            <div class="ride-status-card" id="rideStatusCard">
                <div class="sheet-handle"></div>
                <p>Loading your ride...</p>
            </div>
        </div>
    `;


    refreshCurrentRide();

    window.__ridePollInterval = setInterval(refreshCurrentRide, 4000);
}


async function refreshCurrentRide() {

    const statusCard = document.getElementById("rideStatusCard");

    if (!statusCard) {
        stopRidePolling();
        return;
    }

    const userId = storage.getUserId();


    try {

        const ride = await getCurrentRideForUser(userId);

        rideState.setCurrentRideId(ride.rideId);

        const previousStatus = rideState.getLastKnownStatus();
        rideState.setLastKnownStatus(ride.status);

        // First time we see ACCEPTED for this ride, lock in an ETA
        // target so the countdown doesn't reset every poll cycle.
        if (ride.status === "ACCEPTED" && previousStatus !== "ACCEPTED") {

            const key = `etaTarget_${ride.rideId}`;

            if (!sessionStorage.getItem(key)) {
                const minutesAway = 2 + (seededHash(ride.rideId) % 5); // 2-6 min
                sessionStorage.setItem(key, Date.now() + minutesAway * 60000);
            }
        }

        renderRideStatus(ride);

    } catch (error) {

        if (authGuard.handleAuthError(error, "../../pages/auth/user/user-login.html")) {
            stopRidePolling();
            return;
        }

        // No active ride any more -> figure out whether it finished or was cancelled
        await resolveEndedRide();
    }
}


async function resolveEndedRide() {

    stopRidePolling();

    const rideId = rideState.getCurrentRideId();
    const userId = storage.getUserId();

    if (!rideId) {
        navigateTo("home");
        return;
    }

    try {

        const history = await getUserRideHistory(userId);
        const completedRide = history.find(function (ride) {
            return ride.rideId === rideId;
        });

        if (completedRide) {
            navigateTo("payment");
            return;
        }

    } catch (error) {
        console.error("Ride history check failed:", error);
    }

    // Not in the completed list either -> most likely cancelled
    renderRideEnded();
}


function renderRideEnded() {

    const statusCard = document.getElementById("rideStatusCard");
    if (!statusCard) return;

    document.getElementById("rideMapSlot").innerHTML = "";

    statusCard.innerHTML = `
        <div class="sheet-handle"></div>
        <h2>This ride has ended</h2>
        <p>Your ride request is no longer active.</p>
        <button id="rideEndedHomeBtn" class="home-find-rides-btn" type="button">
            <span>Back to home</span><span>→</span>
        </button>
    `;

    document.getElementById("rideEndedHomeBtn").addEventListener("click", function () {
        rideState.clearRide();
        rideState.clearTrip();
        navigateTo("home");
    });
}


function renderProgressStepper(status) {

    const activeIndex = RIDE_STEPS.indexOf(status);

    return `
        <div class="progress-stepper">
            ${RIDE_STEP_LABELS.map(function (label, index) {
                const state =
                    index < activeIndex ? "done" :
                    index === activeIndex ? "active" : "";

                return `
                    <div class="progress-step ${state}">
                        <span class="progress-step-dot"></span>
                        <span class="progress-step-label">${label}</span>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}


function renderDriverProfileCard(ride) {

    const profile = getDriverProfile(ride.driverId);

    return `
        <div class="driver-profile-card">
            <div class="driver-avatar">${profile.avatar}</div>
            <div class="driver-profile-details">
                <strong>${profile.name}</strong>
                <span class="driver-rating">${renderStarRating(profile.rating)} ${profile.rating}</span>
            </div>
            <div class="driver-plate">${profile.plateNumber}</div>
        </div>
    `;
}


function renderEtaLine(ride) {

    const key = `etaTarget_${ride.rideId}`;
    const target = Number(sessionStorage.getItem(key));

    if (!target) return "";

    const remainingMs = target - Date.now();

    if (remainingMs <= 0) {
        return `<p class="eta-line eta-arrived">Your driver has arrived</p>`;
    }

    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);

    return `<p class="eta-line">Arriving in <strong>${minutes}:${String(seconds).padStart(2, "0")}</strong></p>`;
}


function renderRideStatus(ride) {

    const statusCard = document.getElementById("rideStatusCard");
    const mapSlot = document.getElementById("rideMapSlot");
    if (!statusCard || !mapSlot) return;

    const vehicle = VEHICLES[ride.vehicleType] || {};

    if (window.__etaTickInterval) {
        clearInterval(window.__etaTickInterval);
        window.__etaTickInterval = null;
    }

    switch (ride.status) {

        case "BOOKED":

            mapSlot.innerHTML = renderRouteMap(ride.pickupAddress, ride.dropAddress, "searching");

            statusCard.innerHTML = `
                <div class="sheet-handle"></div>
                ${renderProgressStepper(ride.status)}
                <div class="search-animation">
                    <div class="pulse-ring ring-one"></div>
                    <div class="pulse-ring ring-two"></div>
                    <div class="vehicle-search-icon">${vehicle.icon || "🚗"}</div>
                </div>
                <h2>Finding your driver</h2>
                <p>Looking for a nearby ${(vehicle.name || "ride").toLowerCase()} driver...</p>
                <div id="searchTimeoutLine" class="search-timeout-line"></div>
                ${rideDetailsBlock(ride)}
                <button id="cancelRideBtn" class="cancel-request-btn" type="button">
                    Cancel request
                </button>
            `;

            startDriverSearchTimeout(ride);

            document.getElementById("cancelRideBtn").addEventListener("click", async function (event) {

                const button = event.currentTarget;
                ui.setButtonLoading(button, true, "Cancelling...", "Cancel request");

                try {
                    await cancelRide(ride.rideId, storage.getUserId());
                    stopRidePolling();
                    rideState.clearRide();
                    rideState.clearTrip();
                    ui.toast("Ride cancelled.");
                    navigateTo("home");
                } catch (error) {
                    ui.setButtonLoading(button, false, "", "Cancel request");
                    ui.toast(error.message || "Unable to cancel right now.", "error");
                }
            });

            break;


        case "ACCEPTED":

            mapSlot.innerHTML = renderRouteMap(ride.pickupAddress, ride.dropAddress, "toward");

            statusCard.innerHTML = `
                <div class="sheet-handle"></div>
                ${renderProgressStepper(ride.status)}
                <h2>Driver is on the way</h2>
                <div id="etaLine">${renderEtaLine(ride)}</div>
                ${renderDriverProfileCard(ride)}
                ${rideDetailsBlock(ride)}
                <p class="muted-note">${vehicle.icon || "🚗"} ${vehicle.name} · Fare ₹${ride.fare}</p>
            `;

            window.__etaTickInterval = setInterval(function () {
                const etaLine = document.getElementById("etaLine");
                if (etaLine) {
                    etaLine.innerHTML = renderEtaLine(ride);
                } else {
                    clearInterval(window.__etaTickInterval);
                }
            }, 1000);

            break;


        case "STARTED":

            mapSlot.innerHTML = renderRouteMap(ride.pickupAddress, ride.dropAddress, "trip");

            statusCard.innerHTML = `
                <div class="sheet-handle"></div>
                ${renderProgressStepper(ride.status)}
                <h2>Ride in progress</h2>
                <p>You're on your way to ${ride.dropAddress}.</p>
                ${renderDriverProfileCard(ride)}
                ${rideDetailsBlock(ride)}
            `;

            break;


        default:

            statusCard.innerHTML = `
                <div class="sheet-handle"></div>
                <p>Ride status: ${ride.status}</p>
            `;
    }
}


function startDriverSearchTimeout(ride) {

    if (window.__searchTimeoutInterval) return;

    const key = `searchTimeoutTarget_${ride.rideId}`;

    if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, Date.now() + DRIVER_SEARCH_TIMEOUT_SECONDS * 1000);
    }

    const target = Number(sessionStorage.getItem(key));

    window.__searchTimeoutInterval = setInterval(function () {

        const line = document.getElementById("searchTimeoutLine");
        const remainingMs = target - Date.now();

        if (!line) {
            clearInterval(window.__searchTimeoutInterval);
            window.__searchTimeoutInterval = null;
            return;
        }

        if (remainingMs <= 0) {

            clearInterval(window.__searchTimeoutInterval);
            window.__searchTimeoutInterval = null;

            handleNoDriverFound(ride);
            return;
        }

        line.textContent = `No response yet · giving up in ${Math.ceil(remainingMs / 1000)}s`;

    }, 1000);
}


async function handleNoDriverFound(ride) {

    stopRidePolling();

    try {
        await cancelRide(ride.rideId, storage.getUserId());
    } catch (error) {
        // Ride may have just been accepted right as the timeout fired -
        // either way, stop waiting and let the person decide what's next.
        console.error("Auto-cancel after search timeout failed:", error);
    }

    sessionStorage.removeItem(`searchTimeoutTarget_${ride.rideId}`);
    rideState.clearRide();

    renderNoDriverFound();
}


function renderNoDriverFound() {

    const statusCard = document.getElementById("rideStatusCard");
    const mapSlot = document.getElementById("rideMapSlot");
    if (!statusCard) return;

    if (mapSlot) mapSlot.innerHTML = "";

    statusCard.innerHTML = `
        <div class="sheet-handle"></div>
        <h2>No drivers available right now</h2>
        <p>Nobody accepted your request in time. Your trip details are still saved.</p>
        <button id="retrySearchBtn" class="home-find-rides-btn" type="button">
            <span>Try again</span><span>→</span>
        </button>
        <button id="backHomeFromSearchBtn" class="secondary-text-btn" type="button">
            Back to home
        </button>
    `;

    document.getElementById("retrySearchBtn").addEventListener("click", function () {
        navigateTo("vehicle-selection");
    });

    document.getElementById("backHomeFromSearchBtn").addEventListener("click", function () {
        rideState.clearTrip();
        navigateTo("home");
    });
}


function rideDetailsBlock(ride) {

    return `
        <div class="ride-request-info">
            <div>
                <span>Pickup</span>
                <strong>${ride.pickupAddress}</strong>
            </div>
            <div class="request-divider"></div>
            <div>
                <span>Destination</span>
                <strong>${ride.dropAddress}</strong>
            </div>
        </div>
    `;
}

/* =========================================
   AVAILABLE RIDES (DRIVER)

   The backend assigns one specific driver to
   a ride the moment it's booked (see
   RideServiceImpl.bookRide) - it doesn't
   broadcast to nearby drivers or reassign on
   decline/timeout. So "Decline" here can only
   hide the request from *this* driver's screen;
   it can't free the ride up for another driver,
   because there's no backend endpoint for that
   yet. Flagged clearly in the UI copy below.
========================================= */

const RIDE_RESPONSE_SECONDS = 20;


function getDeclinedRideIds() {
    try {
        return JSON.parse(sessionStorage.getItem("declinedRideIds") || "[]");
    } catch (e) {
        return [];
    }
}

function addDeclinedRideId(rideId) {
    const ids = getDeclinedRideIds();
    if (!ids.includes(rideId)) {
        ids.push(rideId);
        sessionStorage.setItem("declinedRideIds", JSON.stringify(ids));
    }
}


function stopRideRequestCountdown() {
    if (window.__rideRequestCountdown) {
        clearInterval(window.__rideRequestCountdown);
        window.__rideRequestCountdown = null;
    }
}


async function renderAvailableRides() {

    content.innerHTML = `
        <div class="content-card" id="availableRidesCard">
            <h2>Available Rides</h2>
            <p class="muted-note">Checking for ride requests...</p>
        </div>
    `;

    await refreshAvailableRides();

    window.__driverPollInterval = setInterval(refreshAvailableRides, 5000);
}


async function refreshAvailableRides() {

    const card = document.getElementById("availableRidesCard");
    if (!card) {
        stopDriverPolling();
        stopRideRequestCountdown();
        return;
    }

    const driverId = storage.getUserId();

    try {

        const ride = await getDriverPendingRide(driverId);

        if (getDeclinedRideIds().includes(ride.rideId)) {

            card.innerHTML = `
                <h2>Available Rides</h2>
                <p class="muted-note">
                    You declined this rider's request. It's still waiting on your
                    account since ride reassignment isn't supported by the backend yet.
                </p>
            `;

            return;
        }

        // Already showing this exact request with its countdown running -
        // don't reset the card (and the timer) every 5s poll.
        if (document.getElementById("rideRequestCard") &&
            document.getElementById("rideRequestCard").dataset.rideId === String(ride.rideId)) {
            return;
        }

        stopRideRequestCountdown();

        const passenger = getPassengerProfile(ride.userId);

        card.innerHTML = `
            <h2>New ride request</h2>
            <div class="ride-request-card" id="rideRequestCard" data-ride-id="${ride.rideId}">
                <div class="ride-request-icon">${passenger.avatar}</div>
                <div class="ride-request-details">
                    <strong>${passenger.name}</strong>
                    <span class="muted-note">${ride.pickupAddress} → ${ride.dropAddress}</span>
                    <span class="muted-note">${ride.vehicleType} · Fare ₹${ride.fare}</span>
                </div>
                <div class="ride-request-countdown" id="rideCountdown">${RIDE_RESPONSE_SECONDS}s</div>
            </div>
            <div class="ride-response-actions">
                <button id="declineRideBtn" class="decline-action-btn" type="button">
                    Decline
                </button>
                <button id="acceptRideBtn" class="primary-action-btn" type="button">
                    Accept
                </button>
            </div>
        `;

        let secondsLeft = RIDE_RESPONSE_SECONDS;
        const countdownEl = document.getElementById("rideCountdown");

        window.__rideRequestCountdown = setInterval(function () {

            secondsLeft -= 1;

            if (!countdownEl) {
                stopRideRequestCountdown();
                return;
            }

            countdownEl.textContent = `${Math.max(secondsLeft, 0)}s`;

            if (secondsLeft <= 0) {
                stopRideRequestCountdown();
                declineRide(ride.rideId, true);
            }

        }, 1000);


        document.getElementById("declineRideBtn").addEventListener("click", function () {
            declineRide(ride.rideId, false);
        });


        document.getElementById("acceptRideBtn").addEventListener("click", async function (event) {

            const button = event.currentTarget;
            stopRideRequestCountdown();
            ui.setButtonLoading(button, true, "Accepting...", "Accept");

            try {

                await acceptRide(ride.rideId, driverId);

                stopDriverPolling();
                ui.toast("Ride accepted!");

                navItems.forEach(function (navItem) {
                    navItem.classList.toggle("active", navItem.dataset.page === "current-ride");
                });

                loadPage("current-ride");

            } catch (error) {

                if (authGuard.handleAuthError(error, "../auth/driver/driver-login.html")) {
                    return;
                }

                ui.setButtonLoading(button, false, "", "Accept");
                ui.toast(error.message || "Unable to accept this ride.", "error");
            }
        });

    } catch (error) {

        if (authGuard.handleAuthError(error, "../auth/driver/driver-login.html")) {
            stopDriverPolling();
            stopRideRequestCountdown();
            return;
        }

        stopRideRequestCountdown();

        card.innerHTML = `
            <h2>Available Rides</h2>
            <p class="muted-note">No ride requests right now. This checks automatically every few seconds.</p>
        `;
    }
}


function declineRide(rideId, wasTimeout) {

    stopRideRequestCountdown();
    addDeclinedRideId(rideId);

    ui.toast(wasTimeout ? "Request expired." : "Request declined.");

    refreshAvailableRides();
}

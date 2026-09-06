/* =========================================
   CURRENT RIDE (DRIVER)
========================================= */

async function renderDriverCurrentRide() {

    content.innerHTML = `
        <div class="content-card" id="driverCurrentRideCard">
            <h2>Current Ride</h2>
            <p class="muted-note">Loading...</p>
        </div>
    `;

    await refreshDriverCurrentRide();

    window.__driverPollInterval = setInterval(refreshDriverCurrentRide, 5000);
}


async function refreshDriverCurrentRide() {

    const card = document.getElementById("driverCurrentRideCard");
    if (!card) {
        stopDriverPolling();
        return;
    }

    const driverId = storage.getUserId();

    try {

        const ride = await getDriverCurrentRide(driverId);
        renderDriverRideCard(ride);

    } catch (error) {

        if (authGuard.handleAuthError(error, "../auth/driver/driver-login.html")) {
            stopDriverPolling();
            return;
        }

        card.innerHTML = `
            <h2>Current Ride</h2>
            <p class="muted-note">You have no active ride. Check "Available Rides" for new requests.</p>
        `;
    }
}


function renderDriverRideCard(ride) {

    const card = document.getElementById("driverCurrentRideCard");
    if (!card) return;

    const driverId = storage.getUserId();

    const passenger = getPassengerProfile(ride.userId);

    const actionButton = ride.status === "ACCEPTED"
        ? `<button id="rideActionBtn" class="primary-action-btn" type="button">Start Ride</button>`
        : ride.status === "STARTED"
            ? `<button id="rideActionBtn" class="primary-action-btn" type="button">Complete Ride</button>`
            : "";

    card.innerHTML = `
        <h2>Current Ride</h2>
        ${renderRouteMap(ride.pickupAddress, ride.dropAddress, ride.status === "STARTED" ? "trip" : "toward")}
        <div class="ride-request-card">
            <div class="ride-request-icon">${passenger.avatar}</div>
            <div class="ride-request-details">
                <strong>${passenger.name}</strong>
                <span class="muted-note">${ride.pickupAddress} → ${ride.dropAddress}</span>
                <span class="muted-note">${ride.vehicleType} · Fare ₹${ride.fare} · Status: ${ride.status}</span>
            </div>
            ${actionButton}
        </div>
    `;

    const button = document.getElementById("rideActionBtn");
    if (!button) return;

    button.addEventListener("click", async function () {

        const isStarting = ride.status === "ACCEPTED";

        ui.setButtonLoading(
            button,
            true,
            isStarting ? "Starting..." : "Completing...",
            isStarting ? "Start Ride" : "Complete Ride"
        );

        try {

            if (isStarting) {
                await startRide(ride.rideId, driverId);
                ui.toast("Ride started.");
            } else {
                await completeRide(ride.rideId, driverId);
                ui.toast("Ride completed!");
            }

            await refreshDriverCurrentRide();

        } catch (error) {

            if (authGuard.handleAuthError(error, "../auth/driver/driver-login.html")) {
                return;
            }

            ui.setButtonLoading(
                button,
                false,
                "",
                isStarting ? "Start Ride" : "Complete Ride"
            );

            ui.toast(error.message || "Something went wrong.", "error");
        }
    });
}

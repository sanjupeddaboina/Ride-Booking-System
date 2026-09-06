/* =========================================
   RIDE HISTORY SCREEN
========================================= */

async function renderRideHistory() {

    const content = document.getElementById("content");
    if (!content) return;

    content.innerHTML = `
        <div class="history-screen">
            <h2>Your rides</h2>
            <div id="rideHistoryList" class="history-list">
                <p class="muted-note">Loading...</p>
            </div>
        </div>
    `;

    const listEl = document.getElementById("rideHistoryList");
    const userId = storage.getUserId();

    try {

        const rides = await getUserRideHistory(userId);

        if (!rides || rides.length === 0) {
            listEl.innerHTML = `<p class="muted-note">You haven't completed any rides yet.</p>`;
            return;
        }

        // Most recent first
        rides.sort(function (a, b) {
            return new Date(b.bookedAt) - new Date(a.bookedAt);
        });

        listEl.innerHTML = rides.map(function (ride) {

            const vehicle = VEHICLES[ride.vehicleType] || {};
            const date = ride.bookedAt ? new Date(ride.bookedAt).toLocaleString() : "";

            return `
                <div class="history-card">
                    <div class="history-card-icon">${vehicle.icon || "🚗"}</div>
                    <div class="history-card-body">
                        <strong>${ride.pickupAddress} → ${ride.dropAddress}</strong>
                        <span class="muted-note">${date}</span>
                    </div>
                    <div class="history-card-fare">
                        <strong>₹${ride.fare}</strong>
                        <span class="status-badge status-${ride.status.toLowerCase()}">${ride.status}</span>
                    </div>
                </div>
            `;
        }).join("");

    } catch (error) {

        if (authGuard.handleAuthError(error, "../../pages/auth/user/user-login.html")) {
            return;
        }

        listEl.innerHTML = `<p class="muted-note">Unable to load your ride history.</p>`;
    }
}

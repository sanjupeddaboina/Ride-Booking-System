/* =========================================
   RIDE HISTORY (DRIVER)
========================================= */

async function renderDriverRideHistory() {

    content.innerHTML = `
        <div class="content-card">
            <h2>Ride History</h2>
            <div id="driverRideHistoryList" class="history-list">
                <p class="muted-note">Loading...</p>
            </div>
        </div>
    `;

    const listEl = document.getElementById("driverRideHistoryList");
    const driverId = storage.getUserId();

    try {

        const rides = await getDriverRideHistory(driverId);

        if (!rides || rides.length === 0) {
            listEl.innerHTML = `<p class="muted-note">You haven't completed any rides yet.</p>`;
            return;
        }

        rides.sort(function (a, b) {
            return new Date(b.bookedAt) - new Date(a.bookedAt);
        });

        listEl.innerHTML = rides.map(function (ride) {

            const date = ride.bookedAt ? new Date(ride.bookedAt).toLocaleString() : "";

            return `
                <div class="history-card">
                    <div class="history-card-icon">🚗</div>
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

        if (authGuard.handleAuthError(error, "../auth/driver/driver-login.html")) {
            return;
        }

        listEl.innerHTML = `<p class="muted-note">Unable to load ride history.</p>`;
    }
}

/* =========================================
   EARNINGS (DRIVER)
========================================= */

async function renderDriverEarnings() {

    content.innerHTML = `
        <div class="content-card">
            <h2>Your Earnings</h2>
            <div id="earningsBody">
                <p class="muted-note">Loading...</p>
            </div>
        </div>
    `;

    const body = document.getElementById("earningsBody");
    const driverId = storage.getUserId();

    try {

        const [earnings, rides] = await Promise.all([
            getDriverEarnings(driverId),
            getDriverRideHistory(driverId)
        ]);

        const completedCount = rides ? rides.length : 0;

        body.innerHTML = `
            <div class="earnings-total-card">
                <span>Total earnings</span>
                <strong>₹${earnings}</strong>
            </div>
            <p class="muted-note">${completedCount} completed ride${completedCount === 1 ? "" : "s"} so far.</p>
        `;

    } catch (error) {

        if (authGuard.handleAuthError(error, "../auth/driver/driver-login.html")) {
            return;
        }

        body.innerHTML = `<p class="muted-note">Unable to load your earnings.</p>`;
    }
}

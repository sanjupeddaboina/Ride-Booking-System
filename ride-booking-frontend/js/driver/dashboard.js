/* =========================================
   DRIVER DASHBOARD CONTROLLER
========================================= */

const navItems = document.querySelectorAll(".nav-item");
const content = document.getElementById("content");
const pageTitle = document.getElementById("pageTitle");

const statusToggleBtn = document.getElementById("statusToggleBtn");
const driverStatusDot = document.getElementById("driverStatusDot");
const driverStatusLabel = document.getElementById("driverStatusLabel");


// Authentication check
if (!authGuard.requireRole("DRIVER", "../auth/driver/driver-login.html")) {
    // requireRole already redirected
}


// The backend has no "get my current status" endpoint, so we track
// the driver's online/offline state for this browser session and
// default to ONLINE (the status new drivers are registered with).
let driverStatus = sessionStorage.getItem("driverStatus") || "ONLINE";
applyStatusToUI();


function stopDriverPolling() {
    if (window.__driverPollInterval) {
        clearInterval(window.__driverPollInterval);
        window.__driverPollInterval = null;
    }
}


function applyStatusToUI() {

    const isOnline = driverStatus === "ONLINE";

    driverStatusDot.className = "status-dot " + (isOnline ? "online" : "offline");
    driverStatusLabel.textContent = isOnline ? "ONLINE" : "OFFLINE";
    statusToggleBtn.textContent = isOnline ? "Go Offline" : "Go Online";
}


statusToggleBtn.addEventListener("click", async function () {

    const nextStatus = driverStatus === "ONLINE" ? "OFFLINE" : "ONLINE";

    ui.setButtonLoading(statusToggleBtn, true, "Updating...", statusToggleBtn.textContent);

    try {

        await updateDriverStatus(storage.getUserId(), nextStatus);

        driverStatus = nextStatus;
        sessionStorage.setItem("driverStatus", driverStatus);

        applyStatusToUI();
        statusToggleBtn.disabled = false;

        ui.toast(driverStatus === "ONLINE" ? "You're online." : "You're offline.");

    } catch (error) {

        if (authGuard.handleAuthError(error, "../auth/driver/driver-login.html")) {
            return;
        }

        applyStatusToUI();
        ui.toast(error.message || "Unable to update status.", "error");
    }
});


// Navigation
navItems.forEach(function (item) {

    item.addEventListener("click", function () {

        navItems.forEach(function (navItem) {
            navItem.classList.remove("active");
        });

        item.classList.add("active");

        loadPage(item.dataset.page);
    });

});


// Dynamic Page Loader
function loadPage(page) {

    stopDriverPolling();

    switch (page) {

        case "home":

            pageTitle.textContent = "Driver Dashboard";
            renderDriverHome();
            break;


        case "available-rides":

            pageTitle.textContent = "Available Rides";
            renderAvailableRides();
            break;


        case "current-ride":

            pageTitle.textContent = "Current Ride";
            renderDriverCurrentRide();
            break;


        case "ride-history":

            pageTitle.textContent = "Ride History";
            renderDriverRideHistory();
            break;


        case "earnings":

            pageTitle.textContent = "Earnings";
            renderDriverEarnings();
            break;

    }

}


function renderDriverHome() {

    content.innerHTML = `
        <div class="welcome-card">
            <h2>Welcome back, Driver 👋</h2>
            <p>
                Manage your rides, check ride requests, track your
                current trip and monitor your earnings from here.
            </p>
            <div class="home-shortcut-grid">
                <button class="home-shortcut" data-page="available-rides" type="button">
                    🚖 <span>Available Rides</span>
                </button>
                <button class="home-shortcut" data-page="current-ride" type="button">
                    📍 <span>Current Ride</span>
                </button>
                <button class="home-shortcut" data-page="earnings" type="button">
                    💰 <span>Earnings</span>
                </button>
            </div>
        </div>
    `;

    content.querySelectorAll(".home-shortcut").forEach(function (button) {
        button.addEventListener("click", function () {

            const page = button.dataset.page;

            navItems.forEach(function (navItem) {
                navItem.classList.toggle("active", navItem.dataset.page === page);
            });

            loadPage(page);
        });
    });
}


// Load Dashboard initially
loadPage("home");

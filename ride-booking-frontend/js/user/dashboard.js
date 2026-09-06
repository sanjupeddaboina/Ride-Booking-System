document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // AUTHENTICATION CHECK
    // ===============================

    if (!authGuard.requireRole("USER", "../../pages/auth/user/user-login.html")) {
        return;
    }


    // ===============================
    // LOAD USER INFORMATION
    // ===============================

    loadUserProfile();


    // ===============================
    // BOTTOM NAVIGATION
    // ===============================

    const navItems =
        document.querySelectorAll(".bottom-nav-item, .side-nav-item");


    navItems.forEach(function (item) {

        item.addEventListener("click", function () {

            const page = item.dataset.page;

            navigateTo(page);

        });

    });


    // ===============================
    // INITIAL PAGE / ACTIVE RIDE RECOVERY
    // ===============================
    // Keep the ride lifecycle intact after a refresh or reopening
    // the dashboard. The backend is the source of truth; the stored
    // ride id is only used as a fast hint for the first screen.
    const currentRideId = rideState.getCurrentRideId();

    if (currentRideId) {
        navigateTo("current-ride");
        return;
    }

    navigateTo("home");

});



/* =================================
   NAVIGATION CONTROLLER
================================= */

function navigateTo(page) {

    // Any screen-specific background polling (e.g. current-ride
    // status checks) should stop the moment we navigate away.
    if (typeof stopRidePolling === "function") {
        stopRidePolling();
    }

    updateActiveNavigation(page);


    switch (page) {

        case "home":

            renderHome();

            break;


        case "vehicle-selection":

            renderVehicleSelection();

            break;


        case "confirm-ride":

            renderConfirmRide();

            break;


        case "current-ride":

            renderCurrentRide();

            break;


        case "ride-history":

            renderRideHistory();

            break;


        case "payment":

            renderPayment();

            break;


        case "profile":

            renderProfile();

            break;


        default:

            renderHome();

    }

}



/* =================================
   UPDATE ACTIVE NAVIGATION
================================= */

function updateActiveNavigation(page) {

    const navItems =
        document.querySelectorAll(".bottom-nav-item, .side-nav-item");


    navItems.forEach(function (item) {

        item.classList.remove("active");


        if (item.dataset.page === page) {

            item.classList.add("active");

        }

    });

}



/* =================================
   LOAD USER PROFILE
================================= */

function loadUserProfile() {

    const userName =
        storage.getName() ||
        "User";

    const initial =
        userName.charAt(0).toUpperCase();

    const headerUserName =
        document.getElementById("headerUserName");

    const headerUserInitial =
        document.getElementById("headerUserInitial");

    const sideNavUserName =
        document.getElementById("sideNavUserName");

    const sideNavUserInitial =
        document.getElementById("sideNavUserInitial");

    if (headerUserName) {
        headerUserName.textContent = userName;
    }

    if (headerUserInitial) {
        headerUserInitial.textContent = initial;
    }

    if (sideNavUserName) sideNavUserName.textContent = userName;
    if (sideNavUserInitial) sideNavUserInitial.textContent = initial;

    // The login response doesn't include the user's name, only
    // their id/role/token - fetch the profile once so the
    // greeting on Home ("Where are you going, <name>?") and the
    // header are correct even right after logging in.
    if (!storage.getName()) {

        getUserProfile(storage.getUserId())
            .then(function (user) {

                storage.setName(user.name);

                if (headerUserName) headerUserName.textContent = user.name;
                if (headerUserInitial) headerUserInitial.textContent = user.name.charAt(0).toUpperCase();
                if (sideNavUserName) sideNavUserName.textContent = user.name;
                if (sideNavUserInitial) sideNavUserInitial.textContent = user.name.charAt(0).toUpperCase();
            })
            .catch(function (error) {
                console.error("Unable to load profile:", error);
            });
    }
}

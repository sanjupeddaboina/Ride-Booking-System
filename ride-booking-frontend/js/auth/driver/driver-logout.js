const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        if (typeof stopDriverPolling === "function") {
            stopDriverPolling();
        }

        storage.clear();
        sessionStorage.removeItem("driverStatus");

        window.location.href = "../../index.html";

    });

}
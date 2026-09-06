const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        console.log("Logout clicked");

        // Clear authentication data
        storage.clear();

        // Redirect to home page
        window.location.href = "../../index.html";
    });

}
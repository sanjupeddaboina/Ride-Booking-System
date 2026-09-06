const driverLoginForm = document.getElementById("driverLoginForm");
const message = document.getElementById("message");

driverLoginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        message.textContent = "Logging you in...";

        const response = await loginDriver({
            email: email,
            password: password
        });

        console.log("Driver login response:", response);

        // Clear any previous User/Driver session
        storage.clear();

        // Store current driver authentication data
        storage.setAuth(response);

        // Verify correct role
        if (storage.getRole() !== "DRIVER") {
            throw new Error("Invalid driver login response");
        }

        message.textContent = "Login successful! Redirecting...";

        setTimeout(function () {

            window.location.href =
                "../../driver/driver-dashboard.html";

        }, 500);

    } catch (error) {

        console.error("Driver login error:", error);
        message.textContent = error.message;

    }

});
document
    .getElementById("driverRegisterForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const message = document.getElementById("message");

        const driverData = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value,
            phoneNumber: document.getElementById("phoneNumber").value.trim(),
            vehicleType: document.getElementById("vehicleType").value,
            vehicleNumber: document.getElementById("vehicleNumber").value
                .trim()
                .toUpperCase(),
            licenseNumber: document.getElementById("licenseNumber").value
                .trim()
                .toUpperCase()
        };

        try {

            message.textContent = "Creating your driver account...";

            await registerDriver(driverData);

            message.textContent =
                "Driver registration successful! Redirecting to login...";

            setTimeout(function () {

                window.location.href = "driver-login.html";

            }, 1000);

        } catch (error) {

            message.textContent = error.message;

        }

    });
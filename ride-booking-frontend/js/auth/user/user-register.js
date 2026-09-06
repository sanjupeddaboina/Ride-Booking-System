const userRegisterForm = document.getElementById("userRegisterForm");
const message = document.getElementById("message");

userRegisterForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const userData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phoneNumber: document.getElementById("phoneNumber").value.trim(),
        password: document.getElementById("password").value
    };

    try {

        message.textContent = "Registering...";

        await registerUser(userData);

        message.textContent =
            "Registration successful! Redirecting to login...";

        setTimeout(function () {
            window.location.href = "user-login.html";
        }, 1500);

    } catch (error) {

        console.error("Registration error:", error);

        message.textContent =
            error.message || "Registration failed. Please try again.";
    }
});
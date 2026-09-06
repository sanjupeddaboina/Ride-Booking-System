const userLoginForm = document.getElementById("userLoginForm");
const message = document.getElementById("message");

userLoginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        message.textContent = "Logging you in...";

        const response = await loginUser({
            email: email,
            password: password
        });

        console.log("User login response:", response);

        // Clear previous session first
        storage.clear();

        // Store new USER session
        storage.setAuth(response);

        // Verify role
        if (storage.getRole() !== "USER") {
            throw new Error("Invalid user login response");
        }

        message.textContent = "Login successful! Redirecting...";

        setTimeout(function () {
            window.location.href =
                "../../user/user-dashboard.html";
        }, 500);

    } catch (error) {

        console.error("User login error:", error);
        message.textContent = error.message;

    }

});
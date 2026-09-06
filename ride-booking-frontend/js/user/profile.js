/* =========================================
   PROFILE SCREEN
========================================= */

async function renderProfile() {

    const content = document.getElementById("content");
    if (!content) return;

    const cachedName = storage.getName() || "User";
    const initial = cachedName.charAt(0).toUpperCase();

    content.innerHTML = `
        <div class="profile-screen">

            <div class="profile-hero">
                <div class="profile-hero-avatar">${initial}</div>
                <h2 id="profileName">${cachedName}</h2>
                <p id="profileEmail" class="muted-note">Loading...</p>
            </div>

            <div class="profile-details-card">
                <div class="profile-detail-row">
                    <span>Phone number</span>
                    <strong id="profilePhone">—</strong>
                </div>
                <div class="profile-detail-row">
                    <span>Member since</span>
                    <strong id="profileSince">—</strong>
                </div>
            </div>

            <button id="logoutBtn" class="logout-btn" type="button">
                Logout
            </button>

        </div>
    `;

    try {

        const user = await getUserProfile(storage.getUserId());

        storage.setName(user.name);

        document.getElementById("profileName").textContent = user.name;
        document.getElementById("profileEmail").textContent = user.email;
        document.getElementById("profilePhone").textContent = user.phoneNumber;
        document.getElementById("profileSince").textContent =
            user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—";

    } catch (error) {

        if (authGuard.handleAuthError(error, "../../pages/auth/user/user-login.html")) {
            return;
        }

        document.getElementById("profileEmail").textContent = "Unable to load profile details.";
    }

    document.getElementById("logoutBtn").addEventListener("click", function () {
        stopRidePolling();
        storage.clear();
        window.location.href = "../../index.html";
    });
}

// User Registration
async function registerUser(userData) {

    return await apiRequest(
        "/users/register",
        "POST",
        userData
    );
}


// User Login
async function loginUser(loginData) {

    return await apiRequest(
        "/users/login",
        "POST",
        loginData
    );
}


// Get logged-in user's profile
async function getUserProfile(userId) {

    return await apiRequest(
        `/users/${userId}`,
        "GET"
    );
}


// Get the user's active ride (BOOKED / ACCEPTED / STARTED), if any
async function getCurrentRideForUser(userId) {

    return await apiRequest(
        `/users/${userId}/current`,
        "GET"
    );
}


// Get the user's completed ride history
async function getUserRideHistory(userId) {

    return await apiRequest(
        `/users/${userId}/rides`,
        "GET"
    );
}

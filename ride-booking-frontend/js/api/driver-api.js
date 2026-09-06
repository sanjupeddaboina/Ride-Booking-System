async function registerDriver(driverData) {
    return await apiRequest(
        "/drivers/register",
        "POST",
        driverData
    );
}

async function loginDriver(loginData) {
    return await apiRequest(
        "/drivers/login",
        "POST",
        loginData
    );
}


// Go ONLINE / OFFLINE
async function updateDriverStatus(driverId, status) {

    return await apiRequest(
        `/drivers/${driverId}/status`,
        "PUT",
        { status: status }
    );
}


// The single ride (if any) currently waiting for this driver to accept
async function getDriverPendingRide(driverId) {

    return await apiRequest(
        `/drivers/${driverId}/pending`,
        "GET"
    );
}


// The driver's active ride (ACCEPTED / STARTED), if any
async function getDriverCurrentRide(driverId) {

    return await apiRequest(
        `/drivers/${driverId}/current`,
        "GET"
    );
}


async function getDriverEarnings(driverId) {

    return await apiRequest(
        `/drivers/${driverId}/earnings`,
        "GET"
    );
}


async function getDriverRideHistory(driverId) {

    return await apiRequest(
        `/drivers/${driverId}/rides`,
        "GET"
    );
}

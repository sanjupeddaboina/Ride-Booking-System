/* =========================================
   RIDE API

   Note: the ride lifecycle endpoints
   (accept / start / complete / cancel) live
   under /users/{rideId}/rides/... on the
   backend (see RideController), not under a
   separate /rides path.
========================================= */

async function bookRide(rideData) {

    const userId = storage.getUserId();

    if (!userId) {
        throw new Error("User information not found. Please login again.");
    }

    return await apiRequest(
        `/users/${userId}/rides/book`,
        "POST",
        rideData
    );
}


async function acceptRide(rideId, driverId) {

    return await apiRequest(
        `/users/${rideId}/rides/accept`,
        "PUT",
        { driverId: driverId }
    );
}


async function startRide(rideId, driverId) {

    return await apiRequest(
        `/users/${rideId}/rides/start`,
        "PUT",
        { driverId: driverId }
    );
}


async function completeRide(rideId, driverId) {

    return await apiRequest(
        `/users/${rideId}/rides/complete`,
        "PUT",
        { driverId: driverId }
    );
}


async function cancelRide(rideId, userId) {

    return await apiRequest(
        `/users/${rideId}/rides/cancel`,
        "PUT",
        { userId: userId }
    );
}

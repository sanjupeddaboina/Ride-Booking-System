async function makePayment(paymentData) {

    return await apiRequest(
        "/payments",
        "POST",
        paymentData
    );
}


async function getPaymentByRideId(rideId) {

    return await apiRequest(
        `/payments/rides/${rideId}`,
        "GET"
    );
}

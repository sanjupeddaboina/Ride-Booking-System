/* =========================================
   PAYMENT SCREEN
========================================= */

async function renderPayment() {

    const content = document.getElementById("content");
    if (!content) return;

    const rideId = rideState.getCurrentRideId();

    if (!rideId) {
        navigateTo("ride-history");
        return;
    }

    content.innerHTML = `
        <div class="payment-screen">
            <p>Loading trip summary...</p>
        </div>
    `;

    const userId = storage.getUserId();

    try {

        const history = await getUserRideHistory(userId);
        const ride = history.find(function (r) { return r.rideId === rideId; });

        if (!ride) {
            navigateTo("ride-history");
            return;
        }

        // Already paid? Just show the receipt.
        try {

            const existingPayment = await getPaymentByRideId(rideId);
            renderPaymentSuccess(ride, existingPayment);
            return;

        } catch (notPaidYet) {
            // 404 here just means no payment exists yet - continue to the payment form
        }

        renderPaymentForm(ride);

    } catch (error) {

        if (authGuard.handleAuthError(error, "../../pages/auth/user/user-login.html")) {
            return;
        }

        content.innerHTML = `
            <div class="payment-screen">
                <p>Unable to load your trip. Please try again from Ride History.</p>
            </div>
        `;
    }
}


function renderPaymentForm(ride) {

    const content = document.getElementById("content");

    const preferredMethod = sessionStorage.getItem("preferredPaymentMethod") || "CASH";

    content.innerHTML = `
        <div class="payment-screen">

            <div class="screen-topbar">
                <h2>Ride completed 🎉</h2>
            </div>

            <div class="trip-route-summary">
                <div class="route-point">
                    <span class="pickup-dot"></span>
                    <div><label>PICKUP</label><strong>${ride.pickupAddress}</strong></div>
                </div>
                <div class="route-connector"></div>
                <div class="route-point">
                    <span class="destination-dot"></span>
                    <div><label>DESTINATION</label><strong>${ride.dropAddress}</strong></div>
                </div>
            </div>

            <div class="fare-total-card">
                <span>Total fare</span>
                <strong>₹${ride.fare}</strong>
            </div>

            <div class="payment-method-card">
                <label class="section-title">PAY WITH</label>
                <div class="payment-method-options">
                    <button type="button" class="payment-method-option ${preferredMethod === "CASH" ? "selected" : ""}" data-method="CASH">💵 Cash</button>
                    <button type="button" class="payment-method-option ${preferredMethod === "UPI" ? "selected" : ""}" data-method="UPI">📲 UPI</button>
                </div>
            </div>

            <p id="paymentMessage" class="confirm-message"></p>

            <div class="sticky-confirm-bar">
                <button id="payNowBtn" class="home-find-rides-btn" type="button">
                    <span>Pay ₹${ride.fare}</span><span>→</span>
                </button>
            </div>

        </div>
    `;

    let paymentMethod = preferredMethod;

    document.querySelectorAll(".payment-method-option").forEach(function (button) {
        button.addEventListener("click", function () {
            document.querySelectorAll(".payment-method-option").forEach(function (el) {
                el.classList.remove("selected");
            });
            button.classList.add("selected");
            paymentMethod = button.dataset.method;
        });
    });

    const payButton = document.getElementById("payNowBtn");
    const message = document.getElementById("paymentMessage");

    payButton.addEventListener("click", async function () {

        message.textContent = "";
        ui.setButtonLoading(payButton, true, "Processing payment...", `Pay ₹${ride.fare}`);

        try {

            const payment = await makePayment({
                rideId: ride.rideId,
                amount: ride.fare,
                paymentMethod: paymentMethod
            });

            ui.toast("Payment successful!");
            renderPaymentSuccess(ride, payment);

        } catch (error) {

            if (authGuard.handleAuthError(error, "../../pages/auth/user/user-login.html")) {
                return;
            }

            message.textContent = error.message || "Payment failed. Please try again.";
            ui.setButtonLoading(payButton, false, "", `Pay ₹${ride.fare}`);
        }
    });
}


function renderPaymentSuccess(ride, payment) {

    const content = document.getElementById("content");

    rideState.clearRide();
    rideState.clearTrip();

    const profile = getDriverProfile(ride.driverId);

    content.innerHTML = `
        <div class="payment-screen">

            <div class="payment-success-icon">✅</div>
            <h2>Payment successful</h2>
            <p>You paid ₹${payment.amount} via ${payment.paymentMethod} for this ride.</p>

            <div class="trip-route-summary">
                <div class="route-point">
                    <span class="pickup-dot"></span>
                    <div><label>PICKUP</label><strong>${ride.pickupAddress}</strong></div>
                </div>
                <div class="route-connector"></div>
                <div class="route-point">
                    <span class="destination-dot"></span>
                    <div><label>DESTINATION</label><strong>${ride.dropAddress}</strong></div>
                </div>
            </div>

            <div class="rate-driver-card">
                <div class="driver-avatar">${profile.avatar}</div>
                <p>How was your trip with <strong>${profile.name}</strong>?</p>
                <div class="rating-stars" id="ratingStars">
                    ${[1, 2, 3, 4, 5].map(function (n) {
                        return `<button type="button" class="rating-star" data-star="${n}">★</button>`;
                    }).join("")}
                </div>
                <p id="ratingThanks" class="muted-note rating-thanks"></p>
            </div>

            <div class="sticky-confirm-bar">
                <button id="doneBtn" class="home-find-rides-btn" type="button">
                    <span>Back to home</span><span>→</span>
                </button>
            </div>

        </div>
    `;

    // Rating isn't sent anywhere - there's no backend endpoint to store it
    // yet - it's here purely so the trip feels complete, the way Uber
    // always asks before sending you back home.
    document.querySelectorAll(".rating-star").forEach(function (star) {

        star.addEventListener("click", function () {

            const value = Number(star.dataset.star);

            document.querySelectorAll(".rating-star").forEach(function (s) {
                s.classList.toggle("filled", Number(s.dataset.star) <= value);
            });

            document.getElementById("ratingThanks").textContent =
                "Thanks for rating your trip!";
        });
    });

    document.getElementById("doneBtn").addEventListener("click", function () {
        navigateTo("home");
    });
}

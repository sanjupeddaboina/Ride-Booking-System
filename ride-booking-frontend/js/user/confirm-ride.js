/* =========================================
   CONFIRM RIDE SCREEN
========================================= */

function renderConfirmRide() {

    const content = document.getElementById("content");

    if (!content) return;


    if (!rideState.hasTrip()) {
        navigateTo("home");
        return;
    }

    const selected = rideState.getSelectedVehicle();

    if (!selected.type) {
        navigateTo("vehicle-selection");
        return;
    }


    const pickup = rideState.getPickup();
    const drop = rideState.getDrop();
    const vehicle = VEHICLES[selected.type];


    content.innerHTML = `

        <div class="confirm-screen">

            <div class="screen-topbar">
                <button id="confirmBackBtn" class="back-button" type="button">←</button>
                <h2>Confirm your ride</h2>
            </div>


            <div class="confirm-vehicle-card">
                <div class="vehicle-icon">${vehicle.icon}</div>
                <div>
                    <strong>${vehicle.name}</strong>
                    <p>${vehicle.eta} away · ${selected.distanceKm} km trip</p>
                </div>
                <div class="confirm-fare">₹${selected.fare}</div>
            </div>


            <div class="fare-breakdown-card">
                <div class="fare-breakdown-row">
                    <span>Base fare</span>
                    <span>₹${vehicle.baseFare}</span>
                </div>
                <div class="fare-breakdown-row">
                    <span>Distance (${selected.distanceKm} km × ₹${vehicle.perKm})</span>
                    <span>₹${Math.round(vehicle.perKm * selected.distanceKm)}</span>
                </div>
                <div class="fare-breakdown-row total">
                    <span>Total fare</span>
                    <span>₹${selected.fare}</span>
                </div>
            </div>


            <div class="trip-route-summary">

                <div class="route-point">
                    <span class="pickup-dot"></span>
                    <div>
                        <label>PICKUP</label>
                        <strong>${pickup.title}</strong>
                    </div>
                </div>

                <div class="route-connector"></div>

                <div class="route-point">
                    <span class="destination-dot"></span>
                    <div>
                        <label>DESTINATION</label>
                        <strong>${drop.title}</strong>
                    </div>
                </div>

            </div>


            <div class="payment-method-card">

                <label class="section-title">PAY WITH</label>

                <div class="payment-method-options">

                    <button type="button" class="payment-method-option selected" data-method="CASH">
                        💵 Cash
                    </button>

                    <button type="button" class="payment-method-option" data-method="UPI">
                        📲 UPI
                    </button>

                </div>

            </div>


            <p id="confirmMessage" class="confirm-message"></p>


            <div class="sticky-confirm-bar">
                <button id="confirmRideBtn" class="home-find-rides-btn" type="button">
                    <span>Confirm ${vehicle.name} · ₹${selected.fare}</span>
                    <span>→</span>
                </button>
            </div>

        </div>
    `;


    document.getElementById("confirmBackBtn")
        .addEventListener("click", function () {
            navigateTo("vehicle-selection");
        });


    let paymentMethod = "CASH";

    document.querySelectorAll(".payment-method-option").forEach(function (button) {

        button.addEventListener("click", function () {

            document.querySelectorAll(".payment-method-option").forEach(function (el) {
                el.classList.remove("selected");
            });

            button.classList.add("selected");
            paymentMethod = button.dataset.method;
        });
    });


    sessionStorage.setItem("preferredPaymentMethod", paymentMethod);


    const confirmButton = document.getElementById("confirmRideBtn");
    const message = document.getElementById("confirmMessage");


    confirmButton.addEventListener("click", async function () {

        message.textContent = "";

        ui.setButtonLoading(
            confirmButton,
            true,
            "Booking your ride...",
            `Confirm ${vehicle.name} · ₹${selected.fare}`
        );

        sessionStorage.setItem("preferredPaymentMethod", paymentMethod);

        try {

            const rideData = {
                pickupAddress: pickup.title,
                dropAddress: drop.title,
                distance: selected.distanceKm,
                vehicleType: selected.type
            };

            const response = await bookRide(rideData);

            rideState.setCurrentRideId(response.rideId);
            rideState.setLastKnownStatus(response.status);

            navigateTo("current-ride");

        } catch (error) {

            console.error("Book ride error:", error);

            if (authGuard.handleAuthError(error, "../../pages/auth/user/user-login.html")) {
                return;
            }

            message.textContent =
                error.message ||
                "Unable to book this ride. Please try again.";

            ui.setButtonLoading(
                confirmButton,
                false,
                "",
                `Confirm ${vehicle.name} · ₹${selected.fare}`
            );
        }
    });
}

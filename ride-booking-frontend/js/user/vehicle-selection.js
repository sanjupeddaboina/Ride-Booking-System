/* =========================================
   VEHICLE SELECTION SCREEN

   Fare formula mirrors FareCalculationServiceImpl
   on the backend exactly, so the estimate shown
   here matches what gets charged when the ride
   is booked.
========================================= */

const VEHICLES = {

    BIKE: {
        name: "Bike",
        icon: "🏍️",
        description: "Affordable, quick city rides",
        seats: 1,
        eta: "3 min",
        baseFare: 50,
        perKm: 8
    },

    AUTO: {
        name: "Auto",
        icon: "🛺",
        description: "Everyday auto-rickshaw ride",
        seats: 3,
        eta: "4 min",
        baseFare: 70,
        perKm: 12
    },

    MINI: {
        name: "Mini",
        icon: "🚕",
        description: "Comfortable AC hatchback/sedan",
        seats: 4,
        eta: "5 min",
        baseFare: 100,
        perKm: 16
    },

    SEDAN: {
        name: "Sedan",
        icon: "🚘",
        description: "Premium, extra legroom",
        seats: 4,
        eta: "7 min",
        baseFare: 150,
        perKm: 20
    }
};


function calculateFare(vehicleType, distanceKm) {

    const vehicle = VEHICLES[vehicleType];

    return Math.round(vehicle.baseFare + vehicle.perKm * distanceKm);
}


function renderVehicleSelection() {

    const content = document.getElementById("content");

    if (!content) return;


    // Need a trip in progress to be here
    if (!rideState.hasTrip()) {

        navigateTo("home");
        return;
    }


    const pickup = rideState.getPickup();
    const drop = rideState.getDrop();

    const distanceKm = rideState.calculateDistanceKm(
        pickup.latitude,
        pickup.longitude,
        drop.latitude,
        drop.longitude
    );


    content.innerHTML = `

        <div class="vehicle-screen">

            <div class="screen-topbar">

                <button id="vehicleBackBtn" class="back-button" type="button">
                    ←
                </button>

                <h2>Available rides</h2>

            </div>


            ${renderRouteMap(pickup.title, drop.title, "searching")}


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

                <div class="route-distance">
                    ${distanceKm} km
                </div>

            </div>


            <div class="vehicle-list-header">
                <span>Choose a ride</span>
                <span class="muted-note">Prices include estimated fare</span>
            </div>

            <div class="vehicle-list" id="vehicleList"></div>


            <div class="sticky-confirm-bar" id="stickyConfirmBar">

                <button id="confirmVehicleBtn" class="home-find-rides-btn" type="button" disabled>
                    <span id="confirmVehicleLabel">Select a ride</span>
                    <span>→</span>
                </button>

            </div>

        </div>
    `;


    document.getElementById("vehicleBackBtn")
        .addEventListener("click", function () {
            navigateTo("home");
        });


    const vehicleList = document.getElementById("vehicleList");
    const confirmButton = document.getElementById("confirmVehicleBtn");
    const confirmLabel = document.getElementById("confirmVehicleLabel");

    let selectedType = null;

    // Cheapest first, the way real ride-hailing apps default to it
    const orderedTypes = Object.keys(VEHICLES).sort(function (a, b) {
        return calculateFare(a, distanceKm) - calculateFare(b, distanceKm);
    });

    const cheapestType = orderedTypes[0];
    const fastestType = orderedTypes.reduce(function (fastest, type) {
        return parseInt(VEHICLES[type].eta) < parseInt(VEHICLES[fastest].eta) ? type : fastest;
    }, orderedTypes[0]);


    orderedTypes.forEach(function (type) {

        const vehicle = VEHICLES[type];
        const fare = calculateFare(type, distanceKm);
        const distanceFare = Math.round(vehicle.perKm * distanceKm);

        const tag =
            type === cheapestType ? `<span class="vehicle-tag tag-value">Cheapest</span>` :
            type === fastestType ? `<span class="vehicle-tag tag-fast">Fastest</span>` : "";

        const card = document.createElement("button");

        card.type = "button";
        card.className = "ride-vehicle-card";

        card.innerHTML = `
            <div class="vehicle-icon">${vehicle.icon}</div>

            <div class="vehicle-content">
                <div class="vehicle-name-row">
                    <strong>${vehicle.name}</strong>
                    ${tag}
                    <span class="vehicle-arrival-time">${vehicle.eta} away</span>
                </div>
                <div class="vehicle-subtitle">
                    ${vehicle.description} · 👤 ${vehicle.seats}
                </div>
                <div class="vehicle-fare-breakdown">
                    ₹${vehicle.baseFare} base + ₹${distanceFare} for ${distanceKm} km
                </div>
            </div>

            <div class="vehicle-price">₹${fare}</div>
        `;

        card.addEventListener("click", function () {

            document.querySelectorAll(".ride-vehicle-card").forEach(function (el) {
                el.classList.remove("selected");
            });

            card.classList.add("selected");

            selectedType = type;

            confirmButton.disabled = false;
            confirmLabel.textContent = `Confirm ${vehicle.name} · ₹${fare}`;
        });

        vehicleList.appendChild(card);
    });


    confirmButton.addEventListener("click", function () {

        if (!selectedType) return;

        const fare = calculateFare(selectedType, distanceKm);

        rideState.setSelectedVehicle(selectedType, fare, distanceKm);

        navigateTo("confirm-ride");
    });
}

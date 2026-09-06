let selectedVehicle = null;
let rideDistance = null;

const VEHICLES = {
    BIKE: {
        name: "Bike",
        icon: "🏍️",
        description: "Affordable and fast",
        seats: 1,
        eta: "3 min",
        baseFare: 20,
        perKm: 8
    },

    AUTO: {
        name: "Auto",
        icon: "🛺",
        description: "Comfortable city ride",
        seats: 3,
        eta: "4 min",
        baseFare: 30,
        perKm: 10
    },

    MINI: {
        name: "Mini",
        icon: "🚕",
        description: "Comfortable everyday ride",
        seats: 4,
        eta: "5 min",
        baseFare: 50,
        perKm: 14
    },

    SEDAN: {
        name: "Sedan",
        icon: "🚘",
        description: "Premium and comfortable",
        seats: 4,
        eta: "7 min",
        baseFare: 80,
        perKm: 20
    }
};


function initializeBookRide() {

    selectedVehicle = null;
    rideDistance = null;

    const findRidesBtn =
        document.getElementById("findRidesBtn");

    const backBtn =
        document.getElementById("backToSearchBtn");

    const confirmRideBtn =
        document.getElementById("confirmRideBtn");


    // =========================
    // FIND RIDES
    // =========================

    findRidesBtn.addEventListener("click", function () {

        const pickup =
            document.getElementById("pickupAddress")
                .value
                .trim();

        const drop =
            document.getElementById("dropAddress")
                .value
                .trim();

        const message =
            document.getElementById("bookingMessage");


        if (!pickup || !drop) {

            message.textContent =
                "Please enter pickup and destination.";

            return;
        }


        message.textContent = "";


        // Temporary simulation
        // Later replace with Maps API

        rideDistance =
            Math.floor(Math.random() * 12) + 3;


        document.getElementById("tripRoute").textContent =
            pickup + " → " + drop;

        document.getElementById("tripDistance").textContent =
            rideDistance + " km";


        document.getElementById("searchScreen")
            .style.display = "none";

        document.getElementById("vehicleScreen")
            .style.display = "block";


        renderVehicles();
    });


    // =========================
    // BACK TO SEARCH
    // =========================

    backBtn.addEventListener("click", function () {

        selectedVehicle = null;

        document.getElementById("vehicleScreen")
            .style.display = "none";

        document.getElementById("searchScreen")
            .style.display = "block";
    });


    // =========================
    // CONFIRM RIDE
    // =========================

    confirmRideBtn.addEventListener(
        "click",
        async function () {

            if (!selectedVehicle) {
                return;
            }


            const pickup =
                document.getElementById("pickupAddress")
                    .value
                    .trim();

            const drop =
                document.getElementById("dropAddress")
                    .value
                    .trim();


            const rideData = {
                pickupAddress: pickup,
                dropAddress: drop,
                distance: rideDistance,
                vehicleType: selectedVehicle
            };


            try {

                confirmRideBtn.disabled = true;

                confirmRideBtn.textContent =
                    "Booking your ride...";


                // Call backend
                const response =
                    await bookRide(rideData);


                console.log(
                    "Ride booked successfully:",
                    response
                );


                showFindingDriver(
                    selectedVehicle,
                    pickup,
                    drop
                );


            } catch (error) {

                console.error(error);

                document.getElementById(
                    "bookingMessage"
                ).textContent =
                    error.message ||
                    "Unable to book ride.";

                confirmRideBtn.disabled = false;
            }

        }
    );

}


// =========================
// RENDER VEHICLES
// =========================

function renderVehicles() {

    const vehicleList =
        document.getElementById("vehicleList");

    vehicleList.innerHTML = "";

    Object.keys(VEHICLES).forEach(function (type) {

        const vehicle = VEHICLES[type];

        const fare = Math.round(
            vehicle.baseFare +
            rideDistance * vehicle.perKm
        );

        const vehicleCard =
            document.createElement("button");

        vehicleCard.type = "button";

        vehicleCard.className =
            "ride-vehicle-card";

        vehicleCard.innerHTML = `
            <div class="vehicle-icon">
                ${vehicle.icon}
            </div>

            <div class="vehicle-content">

                <div class="vehicle-name-row">

                    <strong>
                        ${vehicle.name}
                    </strong>

                    <span class="vehicle-arrival-time">
                        ${vehicle.eta} away
                    </span>

                </div>

                <div class="vehicle-subtitle">
                    ${vehicle.description}
                    · ${vehicle.seats} seat${vehicle.seats > 1 ? "s" : ""}
                </div>

            </div>

            <div class="vehicle-price">
                ₹${fare}
            </div>
        `;

        vehicleCard.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".ride-vehicle-card")
                    .forEach(function (card) {
                        card.classList.remove("selected");
                    });

                vehicleCard.classList.add("selected");

                selectedVehicle = type;

                const confirmButton =
                    document.getElementById("confirmRideBtn");

                confirmButton.disabled = false;

                confirmButton.textContent =
                    `Choose ${vehicle.name} · ₹${fare}`;
            }
        );

        vehicleList.appendChild(vehicleCard);
    });
}


// =========================
// FINDING DRIVER SCREEN
// =========================

function showFindingDriver(
    vehicleType,
    pickup,
    drop
) {

    const vehicle =
        VEHICLES[vehicleType];


    const content =
        document.getElementById("content");


    content.innerHTML = `

        <div class="finding-driver-page">

            <div class="map-placeholder">

                <div class="map-grid"></div>

                <div class="pickup-pin">
                    ●
                </div>

                <div class="drop-pin">
                    📍
                </div>

                <div class="route-line"></div>

            </div>


            <div class="finding-card">

                <div class="sheet-handle"></div>


                <div class="search-animation">

                    <div class="pulse-ring ring-one"></div>

                    <div class="pulse-ring ring-two"></div>

                    <div class="vehicle-search-icon">

                        ${vehicle.icon}

                    </div>

                </div>


                <h2>
                    Finding your driver
                </h2>


                <p>
                    Looking for a nearby
                    ${vehicle.name.toLowerCase()}
                    driver...
                </p>


                <div class="ride-request-info">

                    <div>

                        <span>Pickup</span>

                        <strong>
                            ${pickup}
                        </strong>

                    </div>


                    <div class="request-divider"></div>


                    <div>

                        <span>Destination</span>

                        <strong>
                            ${drop}
                        </strong>

                    </div>

                </div>


                <button
                    id="cancelRideRequestBtn"
                    class="cancel-request-btn"
                    type="button"
                >
                    Cancel request
                </button>

            </div>

        </div>
    `;


    const cancelButton =
        document.getElementById(
            "cancelRideRequestBtn"
        );


    cancelButton.addEventListener(
        "click",
        function () {

            navigateTo("book-ride");

        }
    );

}
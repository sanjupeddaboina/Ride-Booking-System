/* =========================================
   HOME PAGE
========================================= */

function renderHome() {

    const content =
        document.getElementById("content");

    if (!content) return;


    const userName =
        storage.getName() || "User";


    content.innerHTML = `

        <div class="ride-home">


            <!-- ================= MAP AREA ================= -->

            <section class="home-map">

                <div class="map-grid"></div>

                <div class="map-road road-one"></div>

                <div class="map-road road-two"></div>

                <div class="map-road road-three"></div>


                <!-- CURRENT LOCATION -->

                <div class="current-location">

                    <div class="location-pulse"></div>

                    <div class="location-marker">
                        📍
                    </div>

                    <span>
                        Your location
                    </span>

                </div>


                <!-- VEHICLES -->

                <div class="map-car car-one">
                    🚕
                </div>

                <div class="map-car car-two">
                    🚗
                </div>

                <div class="map-car car-three">
                    🛺
                </div>

            </section>



            <!-- ================= RIDE SEARCH SHEET ================= -->

            <section class="ride-search-sheet">

                <div class="sheet-handle"></div>


                <!-- GREETING -->

                <div class="home-greeting">

                    <span>
                        READY TO RIDE?
                    </span>

                    <h1>
                        Where are you going,
                        <strong>${userName}?</strong>
                    </h1>

                </div>



                <!-- ================= LOCATION SEARCH ================= -->

                <div class="location-search-card">


                    <!-- PICKUP -->

                    <div class="location-input-row">

                        <div
                            class="location-symbol pickup-symbol"
                        ></div>


                        <div
                            class="location-input-wrapper"
                        >

                            <label>
                                FROM
                            </label>


                            <input
                                type="text"
                                id="homePickup"
                                placeholder="Enter pickup location"
                                autocomplete="off"
                            >

                        </div>


                        <button
                            id="gpsLocationBtn"
                            class="gps-location-btn"
                            type="button"
                            title="Use current location"
                        >
                            ⌖
                        </button>

                    </div>



                    <div class="location-divider"></div>



                    <!-- DESTINATION -->

                    <div class="location-input-row">

                        <div
                            class="location-symbol destination-symbol"
                        ></div>


                        <div
                            class="location-input-wrapper"
                        >

                            <label>
                                TO
                            </label>


                            <input
                                type="text"
                                id="homeDestination"
                                placeholder="Where do you want to go?"
                                autocomplete="off"
                            >

                        </div>

                    </div>

                </div>



                <!-- ================= LOCATION SUGGESTIONS ================= -->

                <div
                    id="locationSuggestions"
                    class="location-suggestions"
                ></div>



                <!-- ================= FIND RIDES ================= -->

                <button
                    id="homeFindRidesBtn"
                    class="home-find-rides-btn"
                    type="button"
                    disabled
                >

                    <span>
                        Find rides
                    </span>

                    <span>
                        →
                    </span>

                </button>



                <!-- ================= QUICK LOCATIONS ================= -->

                <div class="quick-locations">

                    <span class="quick-title">
                        QUICK LOCATIONS
                    </span>


                    <div class="quick-location-grid">


                        <button
                            class="quick-location"
                            data-location="Home"
                            type="button"
                        >

                            <span>
                                🏠
                            </span>

                            <span>
                                Home
                            </span>

                        </button>



                        <button
                            class="quick-location"
                            data-location="Work"
                            type="button"
                        >

                            <span>
                                💼
                            </span>

                            <span>
                                Work
                            </span>

                        </button>



                        <button
                            class="quick-location"
                            data-location="Recent location"
                            type="button"
                        >

                            <span>
                                🕘
                            </span>

                            <span>
                                Recent
                            </span>

                        </button>


                    </div>

                </div>

            </section>

        </div>

    `;


    initializeHomeRideSearch();

}



/* =========================================
   FORMAT LOCATION
========================================= */

function formatLocation(location) {

    const address =
        location.address || {};


    /*
        FULL ADDRESS

        This will be stored internally.
    */

    const fullAddress =
        location.display_name || "";


    /*
        TITLE

        Short location name shown to user.

        Example:

        "Hotel SVM Grand, Uppal Metro Station..."
        becomes

        "Uppal Metro Station"

        "Raidurgam, Cyberabad..."
        becomes

        "Raidurgam"
    */


    let title =

        address.amenity ||

        address.shop ||

        address.tourism ||

        address.building ||

        address.railway ||

        address.bus_stop ||

        address.station ||

        address.suburb ||

        address.neighbourhood ||

        address.village ||

        address.town ||

        address.city ||

        address.county ||

        location.name;


    /*
        Fallback to first part of address
    */

    if (!title) {

        title =
            fullAddress
                .split(",")[0]
                .trim();

    }


    /*
        SUBTITLE

        Example:

        Uppal Metro Station
        Uppal, Hyderabad

        Raidurgam
        Madhapur, Hyderabad
    */


    const subtitleParts = [];


    if (
        address.suburb &&
        address.suburb !== title
    ) {

        subtitleParts.push(
            address.suburb
        );

    }


    if (
        address.city &&
        address.city !== title &&
        address.city !== address.suburb
    ) {

        subtitleParts.push(
            address.city
        );

    }


    if (
        subtitleParts.length === 0 &&
        address.state &&
        address.state !== title
    ) {

        subtitleParts.push(
            address.state
        );

    }


    return {

        title: title,

        subtitle:
            subtitleParts.join(", "),

        fullAddress: fullAddress

    };

}



/* =========================================
   INITIALIZE HOME RIDE SEARCH
========================================= */

function initializeHomeRideSearch() {


    /* =========================
       ELEMENTS
    ========================= */

    const pickupInput =
        document.getElementById(
            "homePickup"
        );


    const destinationInput =
        document.getElementById(
            "homeDestination"
        );


    const suggestions =
        document.getElementById(
            "locationSuggestions"
        );


    const findRidesBtn =
        document.getElementById(
            "homeFindRidesBtn"
        );


    const gpsButton =
        document.getElementById(
            "gpsLocationBtn"
        );


    /* =========================
       STATE
    ========================= */

    let activeInput = null;

    let pickupCoordinates = null;

    let destinationCoordinates = null;

    let searchTimeout = null;



    /* =========================================
       VALIDATE INPUTS
    ========================================= */

    function validateRideInputs() {

        const pickup =
            pickupInput.value.trim();


        const destination =
            destinationInput.value.trim();


        /*
            Enable only when:

            Pickup exists
            Destination exists
            Pickup coordinates exist
            Destination coordinates exist
        */

        findRidesBtn.disabled = !(
            pickup &&
            destination &&
            pickupCoordinates &&
            destinationCoordinates
        );

    }



    /* =========================================
       SEARCH LOCATIONS
    ========================================= */

    async function searchLocations(query) {


        /*
            Minimum 2 characters
        */

        if (
            !query ||
            query.length < 2
        ) {

            suggestions.innerHTML = "";

            suggestions.style.display =
                "none";

            return;

        }


        /*
            Loading state
        */

        suggestions.innerHTML = `

            <div class="location-loading">

                Searching locations...

            </div>

        `;


        suggestions.style.display =
            "block";


        try {


            /*
                NOMINATIM
                OpenStreetMap geocoding
            */

            const response =
                await fetch(

                    "https://nominatim.openstreetmap.org/search?" +

                    new URLSearchParams({

                        q: query,

                        format: "json",

                        addressdetails: "1",

                        limit: "6",

                        countrycodes: "in"

                    })

                );


            if (!response.ok) {

                throw new Error(
                    "Location search failed"
                );

            }


            const locations =
                await response.json();


            suggestions.innerHTML = "";


            /*
                No results
            */

            if (
                !locations ||
                locations.length === 0
            ) {

                suggestions.innerHTML = `

                    <div class="no-location">

                        No locations found

                    </div>

                `;

                return;

            }



            /* =========================================
               RENDER LOCATIONS
            ========================================= */

            locations.forEach(
                function (location) {


                    /*
                        Convert long address
                        to short Uber-like format
                    */

                    const formattedLocation =
                        formatLocation(
                            location
                        );


                    const button =
                        document.createElement(
                            "button"
                        );


                    button.type =
                        "button";


                    button.className =
                        "location-suggestion";


                    button.innerHTML = `

                        <span class="suggestion-icon">

                            📍

                        </span>


                        <span class="suggestion-text">


                            <strong>

                                ${formattedLocation.title}

                            </strong>


                            <small>

                                ${
                                    formattedLocation.subtitle ||
                                    "Selected location"
                                }

                            </small>


                        </span>

                    `;



                    /* =========================
                       SELECT LOCATION
                    ========================= */

                    button.addEventListener(
                        "click",
                        function () {


                            /*
                                Show short location
                                in the input
                            */

                            activeInput.value =
                                formattedLocation.title;


                            const coordinates = {

                                latitude:

                                    parseFloat(
                                        location.lat
                                    ),

                                longitude:

                                    parseFloat(
                                        location.lon
                                    )

                            };


                            /* =====================
                               PICKUP
                            ===================== */

                            if (
                                activeInput ===
                                pickupInput
                            ) {


                                pickupCoordinates =
                                    coordinates;


                                sessionStorage.setItem(

                                    "pickupAddress",

                                    formattedLocation.title

                                );


                                sessionStorage.setItem(

                                    "pickupFullAddress",

                                    formattedLocation.fullAddress

                                );


                                sessionStorage.setItem(

                                    "pickupLatitude",

                                    coordinates.latitude

                                );


                                sessionStorage.setItem(

                                    "pickupLongitude",

                                    coordinates.longitude

                                );

                            }


                            /* =====================
                               DESTINATION
                            ===================== */

                            else {


                                destinationCoordinates =
                                    coordinates;


                                sessionStorage.setItem(

                                    "dropAddress",

                                    formattedLocation.title

                                );


                                sessionStorage.setItem(

                                    "dropFullAddress",

                                    formattedLocation.fullAddress

                                );


                                sessionStorage.setItem(

                                    "dropLatitude",

                                    coordinates.latitude

                                );


                                sessionStorage.setItem(

                                    "dropLongitude",

                                    coordinates.longitude

                                );

                            }



                            /*
                                Hide suggestions
                            */

                            suggestions.innerHTML =
                                "";


                            suggestions.style.display =
                                "none";


                            validateRideInputs();

                        }
                    );


                    suggestions.appendChild(
                        button
                    );

                }
            );


        }


        catch (error) {


            console.error(
                "Location search error:",
                error
            );


            suggestions.innerHTML = `

                <div class="no-location">

                    Unable to search locations.
                    Please try again.

                </div>

            `;

        }

    }



    /* =========================================
       HANDLE LOCATION INPUT
    ========================================= */

    function handleLocationInput(input) {


        activeInput =
            input;


        /*
            Reset coordinates when
            user manually changes input
        */

        if (
            input === pickupInput
        ) {

            pickupCoordinates =
                null;

        }

        else {

            destinationCoordinates =
                null;

        }


        validateRideInputs();


        clearTimeout(
            searchTimeout
        );


        const query =
            input.value.trim();


        /*
            Debounce API requests
        */

        searchTimeout =
            setTimeout(
                function () {

                    searchLocations(
                        query
                    );

                },

                400
            );

    }



    /* =========================================
       PICKUP INPUT
    ========================================= */

    pickupInput.addEventListener(

        "input",

        function () {

            handleLocationInput(
                pickupInput
            );

        }

    );


    pickupInput.addEventListener(

        "focus",

        function () {

            activeInput =
                pickupInput;

        }

    );



    /* =========================================
       DESTINATION INPUT
    ========================================= */

    destinationInput.addEventListener(

        "input",

        function () {

            handleLocationInput(
                destinationInput
            );

        }

    );


    destinationInput.addEventListener(

        "focus",

        function () {

            activeInput =
                destinationInput;

        }

    );



    /* =========================================
       GPS CURRENT LOCATION
    ========================================= */

    if (gpsButton) {


        gpsButton.addEventListener(

            "click",

            function () {


                if (
                    !navigator.geolocation
                ) {

                    alert(
                        "GPS is not supported by your browser."
                    );

                    return;

                }


                gpsButton.disabled =
                    true;


                gpsButton.textContent =
                    "...";


                navigator.geolocation.getCurrentPosition(


                    async function (
                        position
                    ) {


                        const latitude =
                            position.coords.latitude;


                        const longitude =
                            position.coords.longitude;


                        pickupCoordinates = {

                            latitude:
                                latitude,

                            longitude:
                                longitude

                        };


                        try {


                            /*
                                Reverse geocoding
                            */

                            const response =
                                await fetch(

                                    "https://nominatim.openstreetmap.org/reverse?" +

                                    new URLSearchParams({

                                        lat:
                                            latitude,

                                        lon:
                                            longitude,

                                        format:
                                            "json",

                                        addressdetails:
                                            "1"

                                    })

                                );


                            if (
                                !response.ok
                            ) {

                                throw new Error(
                                    "Unable to find address"
                                );

                            }


                            const location =
                                await response.json();


                            const formattedLocation =
                                formatLocation(
                                    location
                                );


                            /*
                                Show short name
                            */

                            pickupInput.value =

                                formattedLocation.title ||
                                "Current Location";


                            /*
                                Store data
                            */

                            sessionStorage.setItem(

                                "pickupAddress",

                                pickupInput.value

                            );


                            sessionStorage.setItem(

                                "pickupFullAddress",

                                formattedLocation.fullAddress

                            );


                            sessionStorage.setItem(

                                "pickupLatitude",

                                latitude

                            );


                            sessionStorage.setItem(

                                "pickupLongitude",

                                longitude

                            );


                            validateRideInputs();


                        }


                        catch (
                            error
                        ) {


                            console.error(
                                error
                            );


                            pickupInput.value =
                                "Current Location";


                            sessionStorage.setItem(

                                "pickupAddress",

                                "Current Location"

                            );


                            sessionStorage.setItem(

                                "pickupLatitude",

                                latitude

                            );


                            sessionStorage.setItem(

                                "pickupLongitude",

                                longitude

                            );


                            validateRideInputs();

                        }


                        gpsButton.disabled =
                            false;


                        gpsButton.textContent =
                            "⌖";

                    },


                    function (
                        error
                    ) {


                        console.error(
                            "GPS Error:",
                            error
                        );


                        alert(

                            "Unable to access your current location. " +
                            "Please allow location permission."

                        );


                        gpsButton.disabled =
                            false;


                        gpsButton.textContent =
                            "⌖";

                    },


                    {
                        enableHighAccuracy:
                            true,

                        timeout:
                            10000,

                        maximumAge:
                            0
                    }

                );

            }

        );

    }



    /* =========================================
       QUICK LOCATIONS
    ========================================= */

    document
        .querySelectorAll(
            ".quick-location"
        )
        .forEach(
            function (
                button
            ) {


                button.addEventListener(

                    "click",

                    function () {


                        /*
                            Put quick location
                            into destination
                        */

                        activeInput =
                            destinationInput;


                        destinationInput.value =
                            this.dataset.location;


                        destinationCoordinates =
                            null;


                        /*
                            Search for selected
                            quick location
                        */

                        searchLocations(

                            this.dataset.location

                        );


                        destinationInput.focus();


                        validateRideInputs();

                    }

                );

            }
        );



    /* =========================================
       FIND RIDES
    ========================================= */

    findRidesBtn.addEventListener(

        "click",

        function () {


            const pickup =
                pickupInput.value.trim();


            const destination =
                destinationInput.value.trim();


            if (

                !pickup ||

                !destination ||

                !pickupCoordinates ||

                !destinationCoordinates

            ) {

                return;

            }


            /*
                Final save before
                vehicle selection
            */

            sessionStorage.setItem(

                "pickupAddress",

                pickup

            );


            sessionStorage.setItem(

                "dropAddress",

                destination

            );


            sessionStorage.setItem(

                "pickupCoordinates",

                JSON.stringify(
                    pickupCoordinates
                )

            );


            sessionStorage.setItem(

                "destinationCoordinates",

                JSON.stringify(
                    destinationCoordinates
                )

            );


            /*
                Navigate to
                vehicle selection
            */

            navigateTo("vehicle-selection");

        }

    );



    /* =========================================
       HIDE SUGGESTIONS
       WHEN CLICKING OUTSIDE
    ========================================= */

    document.addEventListener(

        "click",

        function (
            event
        ) {


            const searchSheet =
                document.querySelector(
                    ".ride-search-sheet"
                );


            if (

                searchSheet &&

                !searchSheet.contains(
                    event.target
                )

            ) {

                suggestions.innerHTML =
                    "";


                suggestions.style.display =
                    "none";

            }

        }

    );

}
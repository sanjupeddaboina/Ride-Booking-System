/* =========================================
   RIDE STATE

   Thin wrapper around sessionStorage so the
   ride-booking flow (home -> vehicle
   selection -> confirm -> current ride ->
   payment) shares one clear source of truth
   for pickup, drop, vehicle choice and the
   active ride id.
========================================= */

const rideState = {

    getPickup() {

        return {
            title: sessionStorage.getItem("pickupAddress") || "",
            fullAddress: sessionStorage.getItem("pickupFullAddress") || "",
            latitude: parseFloat(sessionStorage.getItem("pickupLatitude")),
            longitude: parseFloat(sessionStorage.getItem("pickupLongitude"))
        };
    },

    getDrop() {

        return {
            title: sessionStorage.getItem("dropAddress") || "",
            fullAddress: sessionStorage.getItem("dropFullAddress") || "",
            latitude: parseFloat(sessionStorage.getItem("dropLatitude")),
            longitude: parseFloat(sessionStorage.getItem("dropLongitude"))
        };
    },

    hasTrip() {

        const pickup = this.getPickup();
        const drop = this.getDrop();

        return !!(
            pickup.title &&
            drop.title &&
            !isNaN(pickup.latitude) &&
            !isNaN(pickup.longitude) &&
            !isNaN(drop.latitude) &&
            !isNaN(drop.longitude)
        );
    },

    setSelectedVehicle(vehicleType, fare, distanceKm) {

        sessionStorage.setItem("selectedVehicleType", vehicleType);
        sessionStorage.setItem("estimatedFare", fare);
        sessionStorage.setItem("estimatedDistance", distanceKm);
    },

    getSelectedVehicle() {

        return {
            type: sessionStorage.getItem("selectedVehicleType"),
            fare: parseFloat(sessionStorage.getItem("estimatedFare")),
            distanceKm: parseFloat(sessionStorage.getItem("estimatedDistance"))
        };
    },

    setCurrentRideId(rideId) {
        sessionStorage.setItem("currentRideId", rideId);
    },

    getCurrentRideId() {
        const id = sessionStorage.getItem("currentRideId");
        return id ? Number(id) : null;
    },

    setLastKnownStatus(status) {
        sessionStorage.setItem("lastKnownRideStatus", status || "");
    },

    getLastKnownStatus() {
        return sessionStorage.getItem("lastKnownRideStatus") || "";
    },

    // Called once a ride is fully wrapped up (paid / cancelled / ended)
    clearRide() {
        sessionStorage.removeItem("currentRideId");
        sessionStorage.removeItem("lastKnownRideStatus");
    },

    // Called when heading back to search for a brand new trip
    clearTrip() {

        [
            "pickupAddress", "pickupFullAddress", "pickupLatitude", "pickupLongitude",
            "dropAddress", "dropFullAddress", "dropLatitude", "dropLongitude",
            "pickupCoordinates", "destinationCoordinates",
            "selectedVehicleType", "estimatedFare", "estimatedDistance"
        ].forEach(function (key) {
            sessionStorage.removeItem(key);
        });
    },

    /*
        Straight-line (haversine) distance in km between
        pickup and drop. There's no maps/routing API wired up,
        so this is used as a realistic road-distance stand-in
        the same way the fare estimate is a stand-in for a
        live quote.
    */
    calculateDistanceKm(lat1, lon1, lat2, lon2) {

        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Add a small road-vs-straight-line buffer so the
        // estimate doesn't look unrealistically short.
        return +(R * c * 1.25).toFixed(1);
    }

};

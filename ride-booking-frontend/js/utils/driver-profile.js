/* =========================================
   DRIVER PROFILE (SIMULATED)

   The backend doesn't expose a driver profile
   endpoint yet (no name/photo/rating/vehicle
   plate), so this generates a realistic,
   *stable* profile from the driver's id -
   the same driverId always produces the same
   name/rating/plate for the length of the ride,
   the same way a real "assigned driver" card
   wouldn't change mid-ride.

   Swap this out once GET /drivers/{id} exists.
========================================= */

const DRIVER_NAMES = [
    "Arjun Mehta", "Ravi Kumar", "Suresh Nair", "Vikram Rao",
    "Anil Sharma", "Rahul Verma", "Deepak Singh", "Manoj Iyer",
    "Sandeep Gupta", "Rajesh Khanna", "Amit Patel", "Kiran Reddy"
];

const DRIVER_AVATARS = ["🧑🏽", "👨🏻", "🧔🏽", "👨🏾", "🧑🏻", "👨🏼"];


function seededHash(value) {

    let hash = 0;
    const str = String(value);

    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }

    return hash;
}


function getDriverProfile(driverId) {

    const hash = seededHash(driverId);

    const name = DRIVER_NAMES[hash % DRIVER_NAMES.length];
    const avatar = DRIVER_AVATARS[hash % DRIVER_AVATARS.length];

    // Rating between 4.2 and 5.0
    const rating = (4.2 + (hash % 9) / 10).toFixed(1);

    // A believable Indian-style plate, e.g. TS 09 EQ 4471
    const stateCodes = ["TS", "KA", "MH", "DL", "TN", "AP"];
    const state = stateCodes[hash % stateCodes.length];
    const rto = String((hash >> 3) % 90 + 1).padStart(2, "0");
    const letters =
        String.fromCharCode(65 + (hash % 26)) +
        String.fromCharCode(65 + ((hash >> 4) % 26));
    const digits = String((hash >> 6) % 9000 + 1000);

    return {
        name: name,
        avatar: avatar,
        rating: rating,
        plateNumber: `${state} ${rto} ${letters} ${digits}`
    };
}


const PASSENGER_NAMES = [
    "Priya Sharma", "Aisha Khan", "Neha Gupta", "Rohan Das",
    "Sneha Iyer", "Karan Malhotra", "Divya Menon", "Farhan Ali",
    "Pooja Nair", "Vivek Chawla", "Meera Pillai", "Sahil Kapoor"
];

const PASSENGER_AVATARS = ["👩🏽", "👨🏻", "👩🏻", "👨🏽", "👩🏾", "👨🏼"];


// Same idea as getDriverProfile, but for showing who the
// rider is on the driver's ride-request / current-ride cards.
function getPassengerProfile(userId) {

    const hash = seededHash(userId);

    return {
        name: PASSENGER_NAMES[hash % PASSENGER_NAMES.length],
        avatar: PASSENGER_AVATARS[hash % PASSENGER_AVATARS.length]
    };
}


function renderStarRating(rating) {

    const rounded = Math.round(parseFloat(rating));
    let stars = "";

    for (let i = 1; i <= 5; i++) {
        stars += i <= rounded ? "★" : "☆";
    }

    return stars;
}

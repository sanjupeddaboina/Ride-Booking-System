const storage = {

    // =========================
    // TOKEN
    // =========================

    setToken(token) {
        sessionStorage.setItem("token", token);
    },

    getToken() {
        return sessionStorage.getItem("token");
    },


    // =========================
    // ROLE
    // =========================

    setRole(role) {
        sessionStorage.setItem("role", role);
    },

    getRole() {
        return sessionStorage.getItem("role");
    },


    // =========================
    // USER / DRIVER ID
    // =========================

    setUserId(id) {
        sessionStorage.setItem("userId", id);
    },

    getUserId() {
        return sessionStorage.getItem("userId");
    },


    // =========================
    // LOGGED-IN USER / DRIVER NAME
    // =========================

    setName(name) {
        sessionStorage.setItem("name", name);
    },

    getName() {
        return sessionStorage.getItem("name");
    },


    // =========================
    // GENERIC AUTH
    // Supports USER, DRIVER,
    // and future roles
    // =========================

    setAuth(authData) {

        if (!authData) {
            throw new Error("Authentication data is missing");
        }

        // Store token
        if (authData.token) {
            this.setToken(authData.token);
        }

        // Store role
        if (authData.role) {
            this.setRole(authData.role);
        }

        // Supports different backend ID names
        const id =
            authData.userId ??
            authData.driverId ??
            authData.id;

        if (id !== undefined && id !== null) {
            this.setUserId(id);
        }

        // Store name
        if (authData.name) {
            this.setName(authData.name);
        }
    },


    // =========================
    // CLEAR AUTH DATA / LOGOUT
    // =========================

    clear() {

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("name");

    }

};
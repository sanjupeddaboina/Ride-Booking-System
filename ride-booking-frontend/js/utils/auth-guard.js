/* =========================================
   AUTH GUARD

   Small shared helpers so every dashboard
   page checks login state the same way.
========================================= */

const authGuard = {

    /*
        Returns true if the logged-in session
        matches the required role.
        Otherwise clears the session and sends
        the person to the right login page.
    */
    requireRole(requiredRole, loginRedirectPath) {

        const token = storage.getToken();
        const role = storage.getRole();

        if (!token || role !== requiredRole) {

            storage.clear();
            window.location.href = loginRedirectPath;

            return false;
        }

        return true;
    },

    /*
        Call this from inside a catch block after an API call.
        If the failure was an auth failure (401/403), it clears
        the session and redirects; otherwise it does nothing so
        the caller can show its own error message.
    */
    handleAuthError(error, loginRedirectPath) {

        if (error && (error.status === 401 || error.status === 403)) {

            storage.clear();
            window.location.href = loginRedirectPath;

            return true;
        }

        return false;
    }

};

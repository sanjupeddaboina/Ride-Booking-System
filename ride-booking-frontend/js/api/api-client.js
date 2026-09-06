async function apiRequest(endpoint, method = "GET", body = null) {

    const headers = {
        "Content-Type": "application/json"
    };

    // Attach the JWT automatically (if we have one) so every
    // protected endpoint works without each caller repeating this.
    const token = storage.getToken();

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
        method: method,
        headers: headers
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        options
    );

    let data;

    try {
        data = await response.json();
    } catch (error) {
        data = {};
    }

    if (!response.ok) {

        console.error("API Error Status:", response.status);
        console.error("API Error Response:", data);

        const error = new Error(
            data.message ||
            data.error ||
            (response.status === 401 || response.status === 403
                ? "Your session has expired. Please log in again."
                : "Request failed")
        );

        error.status = response.status;

        throw error;
    }

    return data;
}

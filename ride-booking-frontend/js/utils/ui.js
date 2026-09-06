/* =========================================
   SMALL SHARED UI HELPERS
========================================= */

const ui = {

    /*
        Shows a small floating toast message.
        Reuses one element instead of stacking
        new ones on the page.
    */
    toast(message, type) {

        let toastEl = document.getElementById("uiToast");

        if (!toastEl) {

            toastEl = document.createElement("div");
            toastEl.id = "uiToast";
            toastEl.className = "ui-toast";
            document.body.appendChild(toastEl);
        }

        toastEl.textContent = message;
        toastEl.className = "ui-toast show" + (type ? " " + type : "");

        clearTimeout(toastEl._hideTimeout);

        toastEl._hideTimeout = setTimeout(function () {
            toastEl.classList.remove("show");
        }, 3000);
    },

    /*
        Toggles a button between its normal label
        and a "loading" label, disabling it while busy.
    */
    setButtonLoading(button, isLoading, loadingText, defaultText) {

        if (!button) return;

        button.disabled = isLoading;
        button.textContent = isLoading ? loadingText : defaultText;
    }

};

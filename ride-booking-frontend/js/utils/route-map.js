/* =========================================
   ROUTE MAP

   A lightweight, stylised route visual
   (no external maps API/key involved) used
   on the vehicle-selection and current-ride
   screens. "stage" controls the animation:
     - "searching"  -> pulsing rings, no car
     - "toward"     -> car cruising toward pickup
     - "trip"       -> car cruising pickup -> drop
========================================= */

function renderRouteMap(pickupLabel, dropLabel, stage) {

    stage = stage || "trip";

    const pathD = "M 30,140 C 100,40 200,170 270,30";

    const carBlock = stage === "searching"
        ? ""
        : `
            <g>
                <text font-size="22" text-anchor="middle">🚗</text>
                <animateMotion dur="7s" repeatCount="indefinite"
                    path="${stage === "toward" ? "M 260,10 C 200,60 90,90 30,140" : pathD}"
                    rotate="auto"/>
            </g>
        `;

    return `
        <div class="route-map">

            ${stage === "searching" ? `
                <div class="route-map-search-rings">
                    <div class="pulse-ring ring-one"></div>
                    <div class="pulse-ring ring-two"></div>
                </div>
            ` : ""}

            <svg viewBox="0 0 300 170" class="route-map-svg">

                <path d="${pathD}" fill="none" stroke="#c7d2fe"
                      stroke-width="4" stroke-linecap="round"
                      stroke-dasharray="2 10"/>

                <circle cx="30" cy="140" r="7" fill="#22c55e" stroke="#fff" stroke-width="2"/>
                <circle cx="270" cy="30" r="7" fill="#ef4444" stroke="#fff" stroke-width="2"/>

                ${carBlock}

            </svg>

            <div class="route-map-labels">
                <span class="route-map-label pickup">📍 ${pickupLabel}</span>
                <span class="route-map-label drop">🏁 ${dropLabel}</span>
            </div>

        </div>
    `;
}

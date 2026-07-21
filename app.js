document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-btn");
    const cityInput = document.getElementById("city-input");
    const displayArea = document.getElementById("weather-display");

    searchBtn.addEventListener("click", executeQuery);
    cityInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") executeQuery();
    });

    async function executeQuery() {
        const city = cityInput.value.trim();
        if (!city) return;

        displayArea.innerHTML = '<div class="placeholder-msg"><p>Querying external weather layers...</p></div>';

        try {
            // Using wttr.in format=j1 to get pristine JSON output without authentication blockers
            const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
            
            if (!response.ok) {
                throw new Error("Unable to locate spatial coordinates. Check city spelling.");
            }
            
            const data = await response.json();
            renderWeather(data, city);
        } catch (error) {
            displayArea.innerHTML = `
                <div class="error-msg">
                    ⚠️ Engine Exception: ${error.message}
                </div>
            `;
        }
    }

    function renderWeather(data, requestedCity) {
        const currentCondition = data.current_condition[0];
        const area = data.nearest_area[0];
        
        const tempC = currentCondition.temp_C;
        const weatherDesc = currentCondition.weatherDesc[0].value;
        const humidity = currentCondition.humidity;
        const windSpeed = currentCondition.windspeedKmph;
        const visibility = currentCondition.visibility;

        const resolvedName = area.areaName[0].value;
        const country = area.country[0].value;

        displayArea.innerHTML = `
            <div class="weather-card">
                <div class="main-stat">
                    <h2>${resolvedName}, ${country}</h2>
                    <div class="temp-val">${tempC}°C</div>
                    <div class="desc-val">${weatherDesc}</div>
                </div>
                <div class="data-node">
                    <div class="node-label">Humidity Metric</div>
                    <div class="node-val">${humidity}%</div>
                </div>
                <div class="data-node">
                    <div class="node-label">Wind Velocity</div>
                    <div class="node-val">${windSpeed} km/h</div>
                </div>
            </div>
        `;
    }
});
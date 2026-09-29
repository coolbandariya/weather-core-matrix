document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-btn");
    const cityInput = document.getElementById("city-input");
    const displayArea = document.getElementById("weather-display");

    if (!searchBtn || !cityInput || !displayArea) return;

    searchBtn.addEventListener("click", executeQuery);
    cityInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") executeQuery();
    });

    function showMessage(className, message) {
        const wrapper = document.createElement("div");
        wrapper.className = className;
        const paragraph = document.createElement("p");
        paragraph.textContent = message;
        wrapper.appendChild(paragraph);
        displayArea.replaceChildren(wrapper);
    }

    async function executeQuery() {
        const city = cityInput.value.trim();
        if (!city) {
            showMessage("error-msg", "Enter a city name to search.");
            cityInput.focus();
            return;
        }

        searchBtn.disabled = true;
        showMessage("placeholder-msg", "Loading current weather…");

        try {
            const response = await fetch(
                `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
                { headers: { Accept: "application/json" } }
            );
            if (!response.ok) {
                throw new Error(response.status === 404
                    ? "City not found. Check the spelling and try again."
                    : `Weather service returned HTTP ${response.status}.`);
            }

            const data = await response.json();
            renderWeather(data);
        } catch (error) {
            showMessage(
                "error-msg",
                error instanceof TypeError
                    ? "Could not reach the weather service. Check your connection and try again."
                    : (error instanceof Error ? error.message : "Weather data could not be loaded.")
            );
        } finally {
            searchBtn.disabled = false;
        }
    }

    function renderWeather(data) {
        const current = data?.current_condition?.[0];
        const area = data?.nearest_area?.[0];
        if (!current || !area) {
            showMessage("error-msg", "The weather service returned an unexpected response.");
            return;
        }

        const value = (items, fallback = "—") =>
            Array.isArray(items) && items[0]?.value != null ? String(items[0].value) : fallback;

        const card = document.createElement("div");
        card.className = "weather-card";

        const main = document.createElement("div");
        main.className = "main-stat";
        const heading = document.createElement("h2");
        heading.textContent = `${value(area.areaName)}, ${value(area.country)}`;
        const temperature = document.createElement("div");
        temperature.className = "temp-val";
        temperature.textContent = `${current.temp_C ?? "—"}°C`;
        const description = document.createElement("div");
        description.className = "desc-val";
        description.textContent = value(current.weatherDesc);
        main.append(heading, temperature, description);

        const addMetric = (label, metric, unit) => {
            const node = document.createElement("div");
            node.className = "data-node";
            const title = document.createElement("div");
            title.className = "node-label";
            title.textContent = label;
            const result = document.createElement("div");
            result.className = "node-val";
            result.textContent = `${metric ?? "—"}${unit}`;
            node.append(title, result);
            return node;
        };

        card.append(
            main,
            addMetric("Humidity", current.humidity, "%"),
            addMetric("Wind speed", current.windspeedKmph, " km/h"),
            addMetric("Visibility", current.visibility, " km")
        );
        displayArea.replaceChildren(card);
    }
});

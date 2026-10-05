document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("weather-form");
    const searchBtn = document.getElementById("search-btn");
    const cityInput = document.getElementById("city-input");
    const displayArea = document.getElementById("weather-display");

    if (!form || !searchBtn || !cityInput || !displayArea) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        executeQuery();
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
        if (city.length < 2) {
            showMessage("error-msg", "Enter at least two characters for a city name.");
            cityInput.focus();
            return;
        }

        searchBtn.disabled = true;
        displayArea.setAttribute("aria-busy", "true");
        showMessage("placeholder-msg", "Loading current weather…");

        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(
                `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
                {
                    headers: { Accept: "application/json" },
                    signal: controller.signal,
                }
            );
            if (!response.ok) {
                throw new Error(response.status === 404
                    ? "City not found. Check the spelling and try again."
                    : `Weather service returned HTTP ${response.status}.`);
            }

            const data = await response.json();
            renderWeather(data);
        } catch (error) {
            const message = error?.name === "AbortError"
                ? "The weather service took too long to respond. Please try again."
                : error instanceof TypeError
                    ? "Could not reach the weather service. Check your connection and try again."
                    : (error instanceof Error ? error.message : "Weather data could not be loaded.");
            showMessage("error-msg", message);
        } finally {
            window.clearTimeout(timeoutId);
            displayArea.setAttribute("aria-busy", "false");
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
        temperature.setAttribute("aria-label", `${current.temp_C ?? "Unknown"} degrees Celsius`);
        temperature.textContent = `${current.temp_C ?? "—"}°C`;
        const description = document.createElement("div");
        description.className = "desc-val";
        description.textContent = value(current.weatherDesc);
        const source = document.createElement("p");
        source.className = "source-note";
        source.textContent = `Source: wttr.in · Observed ${current.localObsDateTime || "time unavailable"}`;
        main.append(heading, temperature, description, source);

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

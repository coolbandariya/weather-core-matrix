# Dynamic Weather Dashboard

A lightweight, browser-based weather dashboard built with vanilla HTML, CSS, and JavaScript. Enter a city to request and display current weather information.

## Features

- City-based weather lookup
- Dynamic results rendered in the page
- Responsive layout with a dedicated search and results area
- No framework or build step required

## Run locally

Clone the repository and open `index.html` in a modern browser. If the browser blocks local requests, serve the folder with a local HTTP server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Project structure

- `index.html` — page structure
- `style.css` — presentation and responsive styling
- `app.js` — search interaction and weather data handling

## Configuration and limitations

Review `app.js` for the weather data provider and any required API configuration. Provider availability, rate limits, and API-key requirements apply. Weather results are informational and should not be used as the sole basis for safety-critical decisions.

## Future improvements

- Add loading, empty, and API-error states
- Validate city input and support keyboard submission
- Show the data provider and last-updated time
- Add accessible labels and automated browser tests

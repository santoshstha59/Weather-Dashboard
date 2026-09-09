# Weather Dashboard

A responsive React weather dashboard built with Vite.
## Live Demo
https://weather-dashboard-beryl-zeta.vercel.app


## Features

- Search weather by city name
- Current weather display with icon, humidity, wind, pressure, sunrise/sunset
- 5-day forecast cards
- Celsius / Fahrenheit toggle
- Dynamic backgrounds based on weather condition
- Responsive layout for mobile, tablet, and desktop
- Debounced search input
- Last search persisted in `localStorage`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

3. Add your OpenWeatherMap API key to `.env`:

```env
VITE_WEATHER_API_KEY=your_api_key_here
```

4. Run the app:

```bash
npm run dev
```

## Notes

- The API key is read at build time by Vite from `import.meta.env.VITE_WEATHER_API_KEY`.
- Use the free OpenWeatherMap tier and keep requests moderate to avoid rate limiting.

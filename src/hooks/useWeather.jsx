import { useEffect, useState, useCallback, useRef } from 'react';

// Put your OpenWeatherMap API key in a .env file at the project root.
// Example: VITE_WEATHER_API_KEY=your_api_key_here
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const buildUrl = (path, params) => {
  const url = new URL(`${BASE_URL}/${path}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  url.searchParams.set('appid', API_KEY);
  return url;
};

const kelvinToCelsius = (kelvin) => kelvin - 273.15;
const kelvinToFahrenheit = (kelvin) => (kelvin - 273.15) * (9 / 5) + 32;

export const useWeather = (initialCity) => {
  const [city, setCity] = useState(initialCity || '');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [unit, setUnit] = useState('metric');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatWeatherData = (data) => ({
    city: data.name,
    country: data.sys.country,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    sunrise: data.sys.sunrise * 1000,
    sunset: data.sys.sunset * 1000,
    timestamp: data.dt * 1000,
  });

  const formatForecastData = (data) => {
    const dailyMap = new Map();

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      const weatherItem = {
        date,
        temp: item.main.temp,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        description: item.weather[0].description,
      };

      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, {
          date,
          temps: [weatherItem.temp],
          icon: weatherItem.icon,
          humidity: [weatherItem.humidity],
          windSpeed: [weatherItem.windSpeed],
          description: weatherItem.description,
          pop: [item.pop ?? 0],
        });
      } else {
        const day = dailyMap.get(dayKey);
        day.temps.push(weatherItem.temp);
        day.humidity.push(weatherItem.humidity);
        day.windSpeed.push(weatherItem.windSpeed);
        day.pop.push(item.pop ?? 0);
      }
    });

    return Array.from(dailyMap.values())
      .slice(0, 5)
      .map((day) => ({
        date: day.date,
        icon: day.icon,
        tempHigh: Math.max(...day.temps),
        tempLow: Math.min(...day.temps),
        humidity: Math.round(day.humidity.reduce((sum, value) => sum + value, 0) / day.humidity.length),
        windSpeed: Math.round(day.windSpeed.reduce((sum, value) => sum + value, 0) / day.windSpeed.length * 10) / 10,
        pop: Math.round((day.pop.reduce((sum, value) => sum + value, 0) / day.pop.length) * 100),
        description: day.description,
      }));
  };

  const fetchWeather = useCallback(
    async (query) => {
      if (!query) return;
      if (!API_KEY) {
        setError('Missing API key. Put VITE_WEATHER_API_KEY in .env.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const weatherRes = await fetch(
          buildUrl('weather', { q: query, units: unit })
        );
        if (!weatherRes.ok) {
          let message = 'Unable to fetch current weather.';
          if (weatherRes.status === 404) message = 'City not found.';
          if (weatherRes.status === 401) message = 'Invalid API key. Check your .env file.';
          if (weatherRes.status === 429) message = 'Rate limit exceeded. Please wait before searching again.';
          throw new Error(message);
        }
        const weatherData = await weatherRes.json();

        const forecastRes = await fetch(
          buildUrl('forecast', { q: query, units: unit })
        );
        if (!forecastRes.ok) {
          let message = 'Unable to fetch forecast data.';
          if (forecastRes.status === 429) message = 'Rate limit exceeded. Please wait before searching again.';
          throw new Error(message);
        }
        const forecastData = await forecastRes.json();

        setWeather(formatWeatherData(weatherData));
        setForecast(formatForecastData(forecastData));
        localStorage.setItem('lastCity', query);
        localStorage.setItem('weatherUnit', unit);
      } catch (err) {
        setError(err.message || 'Network error. Please try again.');
        setWeather(null);
        setForecast([]);
      } finally {
        setLoading(false);
      }
    },
    [unit]
  );

  const previousUnit = useRef(unit);

  useEffect(() => {
    const savedCity = localStorage.getItem('lastCity');
    const savedUnit = localStorage.getItem('weatherUnit');
    const initial = savedCity || initialCity;

    if (savedUnit === 'imperial' || savedUnit === 'metric') {
      setUnit(savedUnit);
    }

    if (initial) {
      setCity(initial);
      fetchWeather(initial);
    }
  }, [fetchWeather, initialCity]);

  useEffect(() => {
    if (!weather?.city) return;
    if (previousUnit.current !== unit) {
      fetchWeather(weather.city);
      previousUnit.current = unit;
    }
  }, [unit, weather?.city, fetchWeather]);

  const toggleUnit = () => {
    setUnit((current) => {
      const next = current === 'metric' ? 'imperial' : 'metric';
      localStorage.setItem('weatherUnit', next);
      return next;
    });
  };

  return {
    city,
    setCity,
    weather,
    forecast,
    unit,
    loading,
    error,
    fetchWeather,
    toggleUnit,
  };
};

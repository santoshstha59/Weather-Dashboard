import React from 'react';

const CurrentWeather = ({ weather, unit }) => {
  if (!weather) return null;

  const temperatureUnit = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const dateTime = new Date(weather.timestamp).toLocaleString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <section className="current-weather card">
      <div className="current-header">
        <div>
          <h1>{weather.city}, {weather.country}</h1>
          <p>{dateTime}</p>
          <p className="weather-description">
            <span className="weather-badge">{weather.description}</span>
          </p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
          alt={weather.description}
          className="weather-icon"
        />
      </div>

      <div className="temperature-row">
        <div className="temperature-large">
          {Math.round(weather.temp)}{temperatureUnit}
        </div>
        <div className="temp-details">
          <p>Feels like {Math.round(weather.feelsLike)}{temperatureUnit}</p>
          <p>Humidity {weather.humidity}%</p>
          <p>Wind {weather.windSpeed} {windUnit}</p>
        </div>
      </div>

      <div className="extra-details">
        <div>
          <span>Pressure</span>
          <strong>{weather.pressure} hPa</strong>
        </div>
        <div>
          <span>Sunrise</span>
          <strong><span className="extra-icon">🌅</span>{formatTime(weather.sunrise)}</strong>
        </div>
        <div>
          <span>Sunset</span>
          <strong><span className="extra-icon">🌇</span>{formatTime(weather.sunset)}</strong>
        </div>
      </div>
    </section>
  );
};

export default CurrentWeather;

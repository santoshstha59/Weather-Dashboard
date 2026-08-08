import React from 'react';

const ForecastCard = ({ day, unit }) => {
  const temperatureUnit = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';
  const dayName = day.date.toLocaleDateString([], { weekday: 'short' });

  return (
    <article className="forecast-card">
      <p className="forecast-day">{dayName}</p>
      <img
        src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
        alt={day.description}
        className="forecast-icon"
      />
      <p className="forecast-description">
        <span className="forecast-badge">{day.description}</span>
      </p>
      <p className="forecast-temp">
        <span>High {Math.round(day.tempHigh)}{temperatureUnit}</span>
        <span>Low {Math.round(day.tempLow)}{temperatureUnit}</span>
      </p>
      <div className="forecast-details">
        <span>Humidity {day.humidity}%</span>
        <span>Wind {day.windSpeed} {windUnit}</span>
      </div>
      <div className="forecast-pop">
        <span>Rain {day.pop}%</span>
      </div>
    </article>
  );
};

export default ForecastCard;

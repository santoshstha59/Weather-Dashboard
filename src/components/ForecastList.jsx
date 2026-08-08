import React from 'react';
import ForecastCard from './ForecastCard';

const ForecastList = ({ forecast, unit }) => {
  if (!forecast.length) return null;

  return (
    <section className="forecast-list card">
      <h2>5-Day Forecast</h2>
      <div className="forecast-grid">
        {forecast.map((day) => (
          <ForecastCard key={day.date.toISOString()} day={day} unit={unit} />
        ))}
      </div>
    </section>
  );
};

export default ForecastList;

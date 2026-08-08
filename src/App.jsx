import React, { useMemo, useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import SearchHistory from './components/SearchHistory';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import { useWeather } from './hooks/useWeather';
import { useDebounce } from './hooks/useDebounce';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('weatherTheme') || 'dark');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const debouncedSearch = useDebounce(searchQuery, 300);
  const {
    city,
    setCity,
    weather,
    forecast,
    unit,
    loading,
    error,
    fetchWeather,
    toggleUnit,
  } = useWeather('London');

  useEffect(() => {
    localStorage.setItem('weatherTheme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 5)));
  }, [history]);

  const addHistory = (query) => {
    const normalized = query.trim();
    if (!normalized) return;
    setHistory((current) => [normalized, ...current.filter((item) => item.toLowerCase() !== normalized.toLowerCase())].slice(0, 5));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const backgroundClass = useMemo(() => {
    if (!weather) return 'weather-clear';
    const condition = weather.description.toLowerCase();
    if (condition.includes('rain')) return 'weather-rain';
    if (condition.includes('cloud')) return 'weather-clouds';
    if (condition.includes('snow')) return 'weather-snow';
    if (condition.includes('storm') || condition.includes('thunder')) return 'weather-storm';
    return 'weather-clear';
  }, [weather]);

  const handleSearch = () => {
    const query = (searchTerm.trim() || city).trim();
    if (query) {
      setSearchTerm(query);
      setSearchQuery(query);
      setCity(query);
      addHistory(query);
    }
  };

  const handleHistorySelect = (query) => {
    setSearchTerm(query);
    setSearchQuery(query);
    setCity(query);
    addHistory(query);
  };

  useEffect(() => {
    if (!debouncedSearch) return;
    fetchWeather(debouncedSearch);
  }, [debouncedSearch, fetchWeather]);

  const tempUnitLabel = unit === 'metric' ? '°C' : '°F';
  const themeLabel = theme === 'dark' ? 'Light Mode' : 'Dark Mode';

  return (
    <div className={`app-shell ${backgroundClass} theme-${theme}`}>
      <main className="app-container">
        <div className="top-row">
          <div>
            <h1>Weather Dashboard</h1>
            <p>Search a city to see current weather and forecast.</p>
          </div>
          <div className="button-row">
            <button className="theme-toggle" type="button" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>
              {themeLabel}
            </button>
            <button className="unit-toggle" type="button" onClick={toggleUnit}>
              {tempUnitLabel}
            </button>
          </div>
        </div>

        <SearchBar city={searchTerm} onCityChange={setSearchTerm} onSearch={handleSearch} loading={loading} />
        <SearchHistory history={history} onSelect={handleHistorySelect} onClear={clearHistory} />

        {error && <div className="error-box">{error}</div>}

        {loading && (
          <div className="loading-box" aria-live="polite" aria-busy="true">
            <span className="loading-spinner" />
            Loading weather data...
          </div>
        )}

        {!loading && weather && (
          <>
            <CurrentWeather weather={weather} unit={unit} />
            <ForecastList forecast={forecast} unit={unit} />
          </>
        )}
      </main>
    </div>
  );
};

export default App;

import React from 'react';

const SearchBar = ({ city, onCityChange, onSearch, loading }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={city}
        onChange={(event) => onCityChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search city name"
        aria-label="City search"
      />
      <button type="button" onClick={onSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};

export default SearchBar;

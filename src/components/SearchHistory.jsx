import React from 'react';

const SearchHistory = ({ history, onSelect, onClear }) => {
  return (
    <section className="search-history card">
      <div className="history-header">
        <h3>Recent searches</h3>
        {history.length > 0 && (
          <button type="button" className="clear-history" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      {history.length > 0 ? (
        <div className="history-list">
          {history.map((item) => (
            <button
              key={item}
              type="button"
              className="history-chip"
              onClick={() => onSelect(item)}
            >
              {item}
            </button>
          ))}
        </div>
      ) : (
        <p className="history-empty">No recent searches yet. Try searching for a city.</p>
      )}
    </section>
  );
};

export default SearchHistory;

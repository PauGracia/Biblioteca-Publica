// SearchBox.jsx
import React, { useState, useEffect } from 'react';

function SearchBox({ books, onSearch, onSelectBook }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 3 && books.length > 0) {
      const filtered = books
        .filter(book =>
          book.titol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.autor?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm, books]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.length >= 3) {
      onSearch(searchTerm);
      setSearchTerm('');
      setShowResults(false);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelect = (book) => {
    onSelectBook(book.id);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div
      className="search-container"
      onBlur={() => setTimeout(() => setShowResults(false), 100)}
    >
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Cercar llibres pel títol o per l'autor..."
          className="search-input"
          value={searchTerm}
          onChange={handleChange}
          
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
        />
        <button type="submit" className="search-button">🔍</button>
      </form>

      {showResults && (
        <div className="search-results">
          {searchResults.length > 0 ? (
            searchResults.map(book => (
              <div
                key={book.id}
                className="search-result-item"
                onMouseDown={() => handleSelect(book)}
                style={{ cursor: 'pointer' }}
              >
                <div className="search-result-title">{book.titol}</div>
                <div className="search-result-author">
                  {book.autor || 'Autor desconegut'}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No s'han trobat resultats</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBox;

// src/pages/Exemplars.jsx
import React, { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import CarritoExemplars from '../components/CarritoExemplars';
import ImprimirExemplars from './ImprimirExemplars';

function Exemplars({ goToCarrito }) {
  const [exemplars, setExemplars] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCarrito, setSelectedCarrito] = useState(false);
  const [selected, setSelected] = useState(() => {
    const s = localStorage.getItem('selectedExemplars');
    return s ? JSON.parse(s) : [];
  });
  const [loading, setLoading] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [printMode, setPrintMode] = useState(false);

  const booksForSearch = exemplars.map(e => ({
    id: e.id,
    titol: e.registre,
    autor: e.cataleg?.titol || ''
  }));

  useEffect(() => {
    fetch('https://biblioteca5.ieti.site/api/exemplars')
    // fetch('http://127.0.0.1:8000/api/exemplars')
      .then(res => {
        if (!res.ok) throw new Error('Error fetching exemplars');
        return res.json();
      })
      .then(data => {
        setExemplars(data);
        setFiltered(data);
      })
      .catch(err => console.error('Error loading exemplars:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedExemplars', JSON.stringify(selected));
  }, [selected]);

  const handleSearch = term => {
    if (loading) return;
    const t = term.trim();
    setSearchTerm(term);
    setSearchActive(t.length >= 3);

    let result = [];
    const parts = t.split(/\s+/);

    // Nuevo: búsqueda por rango de dos registros completos
    // Formato esperado: "REG-0275-2703 REG-0275-3003"
    if (parts.length === 2 && parts[0].toUpperCase().startsWith('REG-') && parts[1].toUpperCase().startsWith('REG-')) {
      const start = parts[0].toUpperCase();
      const end = parts[1].toUpperCase();
      result = exemplars.filter(e => {
        const reg = e.registre.toUpperCase();
        return reg >= start && reg <= end;
      });
    } else {
      // Búsqueda normal por texto
      const low = t.toLowerCase();
      result = exemplars.filter(e =>
        e.registre.toLowerCase().includes(low) ||
        (e.cataleg?.titol || '').toLowerCase().includes(low)
      );
    }

    setFiltered(result);
    setCurrentPage(1);
  };

  const handleSelect = id => {
    const item = exemplars.find(e => e.id === id);
    if (item && !selected.some(s => s.id === id)) {
      setSelected(prev => [...prev, item]);
    }
  };

  const handleToggleCarrito = () => {
    setSelectedCarrito(prev => !prev);
  };

  const handleRemove = id => {
    setSelected(prev => prev.filter(s => s.id !== id));
  };

  const handleClearAll = () => {
    if (!searchActive) {
      if (window.confirm('Buidar tot el carretó?')) setSelected([]);
    } else {
      if (window.confirm('Buidar tots els filtrats?')) {
        const idsFiltered = filtered.map(e => e.id);
        setSelected(prev => prev.filter(item => !idsFiltered.includes(item.id)));
      }
    }
  };

  const handlePrint = () => { setPrintMode(true); };
  const handlePrintOff = () => { setPrintMode(false); };

  // Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexFirst = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(indexFirst, indexFirst + itemsPerPage);

  const selectAllFiltered = () => {
    const newSelections = filtered.filter(item => !selected.some(s => s.id === item.id));
    setSelected(prev => [...prev, ...newSelections]);
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const pos = maxPagesToShow - 2;
    let start = currentPage - pos;
    let end = start + maxPagesToShow - 1;

    if (start < 1) { start = 1; end = Math.min(totalPages, maxPagesToShow); }
    if (end > totalPages) { end = totalPages; start = Math.max(1, end - maxPagesToShow + 1); }
    if (start > 1) pages.push(<span key="start-ellipsis">...</span>);
    for (let i = start; i <= end; i++) pages.push(
      <button key={i} onClick={() => setCurrentPage(i)} className={`paginator-button ${currentPage === i ? 'paginator-active' : ''}`}>{i}</button>
    );
    if (end < totalPages) pages.push(<span key="end-ellipsis">...</span>);

    return (
      <div className="pagination-container">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="paginator-button paginator-nav">Anterior</button>
        <div className="page-numbers">{pages}</div>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="paginator-button paginator-nav">Següent</button>
      </div>
    );
  };

  if (printMode) {
    return <ImprimirExemplars items={selected} onPrint={handlePrintOff} />;
  }

  return (
    <div className="container">
      <div className="exemplars-container" onClick={e => e.stopPropagation()}>
        <header className="exemplars-header">
          <h1>Gestió d'Exemplars</h1>
          <div className="carrito-summary" style={{ margin: '10px' }} onClick={handleToggleCarrito}>
            {selectedCarrito ? <span className="back-icon">← Volver</span> : <><span className="carrito-icon">Lista 🛒: </span><span className="carrito-count">{selected.length}</span></>}
          </div>
        </header>

        {selectedCarrito ? (
          <CarritoExemplars
            items={selected}
            onRemove={handleRemove}
            onClearAll={handleClearAll}
            onPrint={handlePrint}
            goToExemplars={goToCarrito}
          />
        ) : (
          <>
            {/* … resto de la UI de búsqueda, listado y paginador … */}
            <div className="search-controls">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Carregant exemplars...</p>
                </div>
              ) : (
                <SearchBox books={booksForSearch} onSearch={handleSearch} onSelectBook={handleSelect} />
              )}

              {searchActive && (
                <div className="batch-actions">
                  <button onClick={selectAllFiltered} className="batch-btn">Seleccionar tots</button>
                  <button onClick={handleClearAll} className="batch-btn">Borrar tots</button>
                </div>
              )}
            </div>

            {searchActive && (
              <div className="search-status">
                <h2>Resultats per: "{searchTerm}"</h2>
                <div className="search-info">
                  <span>{filtered.length} exemplars trobats</span>
                  <button style={{ marginLeft: '10px' }} onClick={() => setSearchActive(false)} className="clear-search-btn">Nova cerca</button>
                </div>
              </div>
            )}

            {searchActive && (
              <ul className="exemplars-list">
                {currentItems.map(item => (
                  <li key={item.id} className="exemplar-item">
                    <span>{item.registre} — {item.cataleg?.titol}</span>
                    <button onClick={() => selected.some(s => s.id === item.id) ? handleRemove(item.id) : handleSelect(item.id)} className="add-remove-btn">
                      {selected.some(s => s.id === item.id) ? 'Eliminar' : 'Afegir'}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {searchActive && filtered.length > itemsPerPage && renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}

export default Exemplars;
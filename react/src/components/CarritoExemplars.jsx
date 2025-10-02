import React, { useState } from 'react';
import Button from './Button';

function CarritoExemplars({ items, onRemove, onPrint }) {
  const [currentPage, setCurrentPage] = useState(1);
  const contadorCarrito = items.length;
  const itemsPerPage = 20;
  const totalPages = Math.ceil(contadorCarrito / itemsPerPage);
  const indexFirst = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(indexFirst, indexFirst + itemsPerPage);

  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  // Nueva función para borrar todo sin usar onClearAll
  const handleClearAll = () => {
    // Eliminamos cada ítem uno por uno
    items.forEach(item => onRemove(item.id));
    // Reiniciamos la paginación
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const positionIndex = maxPagesToShow - 2; // antepenúltima posición

    let startPage = currentPage - positionIndex;
    let endPage = startPage + maxPagesToShow - 1;

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(totalPages, maxPagesToShow);
    }
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(<span key="start-ellipsis">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`paginator-button ${currentPage === i ? 'paginator-active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(<span key="end-ellipsis">...</span>);
    }

    return (
      <div className="pagination-container">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="paginator-button paginator-nav"
        >
          Anterior
        </button>
        <div className="page-numbers">{pages}</div>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="paginator-button paginator-nav"
        >
          Següent
        </button>
      </div>
    );
  };

  return (
    <div className="carrito-container" onClick={e => e.stopPropagation()}>
      {contadorCarrito > 0 ? (
        <>
          <br />
          <span className="badge">Quantitat d'exemplars: {contadorCarrito}</span>
          <button
            onClick={handleClearAll}
            className="add-remove-btn"
          >
            Buidar carretó
          </button>
          <button
            onClick={onPrint}
            className="add-remove-btn"
          >
            Imprimir etiquetes
          </button>
          <br /><br />
          <div className="carrito-dropdown">
            <div className="carrito-list">
              {currentItems.map(item => (
                <div key={item.id} className="carrito-item">
                  {item.registre} — {item.cataleg?.titol}
                  <button
                    onClick={() => onRemove(item.id)}
                    className="remove-btn"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
            {/* Paginador */}
            {totalPages > 1 && renderPagination()}
          </div>
        </>
      ) : (
        <span>Encara no n'hi ha ningun exemplar a la llista</span>
      )}
    </div>
  );
}

export default CarritoExemplars;

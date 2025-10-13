import { useEffect, useState } from "react";
import BookItem from "./BookItem";
import SearchBox from "./SearchBox";
import imgReact from "../assets/biblioteca.png";

function BookList({ onSelectBook }) {
  const [books, setBooks] = useState([]);
  const [exemplars, setExemplars] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 9;

  // Ya no cargamos todos los libros al inicio automáticamente
  // Sólo cargaremos los ejemplares para tener disponible esta información
  useEffect(() => {
    fetchExemplars();
    // Cargar todos los libros también para que el autocompletado funcione correctamente
    fetchAllBooks();
  }, []);

  const fetchExemplars = async () => {
    try {
      const [resBooks, resExemplars] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/llibres"),
        fetch("http://127.0.0.1:8000/api/exemplars"),
      ]);

      if (!resBooks.ok || !resExemplars.ok)
        throw new Error("Error en la carga");

      const booksData = await resBooks.json();
      const exemplarsData = await resExemplars.json();
      setExemplars(exemplarsData);
    } catch (error) {
      console.error("Error fetching exemplars data:", error);
    }
  };

  const fetchAllBooks = async () => {
    try {
      const resBooks = await fetch("http://127.0.0.1:8000/api/llibres");
      if (!resBooks.ok) throw new Error("Error en la càrrega de llibres");
      

      const booksData = await resBooks.json();
      setBooks(booksData); // Cargamos todos los libros para el autocompletado
    } catch (error) {
      console.error("Error fetching all books data:", error);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (!term || term.trim() === "") {
      setDisplayedBooks([]);
      setSearchActive(false);
      return;
    }

    setLoading(true);
    setCurrentPage(1); // Reset a la primera página con cada nueva búsqueda

    try {
      // Filtramos de los libros ya cargados
      const filtered = books.filter(
        (book) =>
          book.titol.toLowerCase().includes(term.toLowerCase()) ||
          (book.autor && book.autor.toLowerCase().includes(term.toLowerCase()))
      );

      setDisplayedBooks(filtered);
      setSearchActive(true);
    } catch (error) {
      console.error("Error in search:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDisplayedBooks([]);
    setSearchActive(false);
    setCurrentPage(1);
  };

  const getTotalDisponiblesPorLibro = (bookId) => {
    return exemplars.filter((e) => e.cataleg?.id === bookId && !e.baixa).length;
  };

  // Lógica de paginación
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = displayedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(displayedBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Renderizar números de página
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Número máximo de páginas visibles

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Ajustar si estamos en los extremos
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Añadir primera página y elipsis si es necesario
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => paginate(1)}
          className="paginator-button"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis1" className="paginator-ellipsis">
            ...
          </span>
        );
      }
    }

    // Añadir páginas numeradas
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`paginator-button ${
            currentPage === i ? "paginator-active" : ""
          }`}
        >
          {i}
        </button>
      );
    }

    // Añadir última página y elipsis si es necesario
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis2" className="paginator-ellipsis">
            ...
          </span>
        );
      }
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => paginate(totalPages)}
          className="paginator-button"
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="container">
      <div className="header">
        <img src={imgReact} alt="React Logo" className="logo" />
        <h1 className="h1">Biblioteca Pública</h1>
      </div>

      <SearchBox
        books={books}
        onSearch={handleSearch}
        onSelectBook={onSelectBook}
      />

      <div className="books-section">
        {searchActive ? (
          <div className="search-status">
            <h2 className="h2">Resultats per: "{searchTerm}"</h2>
            <div className="search-info">
              <span className="results-count">
                {displayedBooks.length} llibres trobats
              </span>
              <button onClick={clearSearch} className="clear-search-btn">
                Nova cerca
              </button>
            </div>
          </div>
        ) : (
          <div
            className="no-books-container"
            style={{ marginTop: "50px", padding: "40px 20px" }}
          >
            <h2 className="h2">Cercador de llibres</h2>
            <p
              className="no-books-message"
              style={{ fontSize: "18px", marginTop: "20px" }}
            >
              Introdueix el títol o l'autor del llibre que cerques a la barra de
              cerca superior.
            </p>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregant llibres...</p>
          </div>
        ) : searchActive && currentBooks.length > 0 ? (
          <>
            <ul className="books-grid">
              {currentBooks.map((book) => (
                <li
                  key={book.id}
                  className="book-item"
                  onClick={() => onSelectBook(book.id)}
                  style={{ cursor: "pointer" }}
                >
                  <BookItem
                    book={book}
                    onSelect={onSelectBook}
                    totalExemplars={getTotalDisponiblesPorLibro(book.id)}
                  />
                </li>
              ))}
            </ul>

            {/* Paginador */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="paginator-button paginator-nav"
                >
                  &laquo; Anterior
                </button>

                <div className="page-numbers">{renderPageNumbers()}</div>

                <button
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="paginator-button paginator-nav"
                >
                  Següent &raquo;
                </button>
              </div>
            )}
          </>
        ) : searchActive && displayedBooks.length === 0 ? (
          <div className="no-books-container">
            <p className="no-books-message">
              No s'han trobat llibres que coincideixin amb la teva cerca.
            </p>
            <button onClick={clearSearch} className="clear-search-btn">
              Nova cerca
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default BookList;

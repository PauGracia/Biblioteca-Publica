import { useEffect, useState } from "react";

function BookDetails({ bookId, onBack, extraProp, userRole, onCrearPrestac }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/llibres/${bookId}`
        );
        console.error(bookId);

        if (!response.ok) {
          throw new Error("No s'ha pogut obtenir el llibre");
        }
        const bookData = await response.json();
        console.log("Detalls del llibre:", JSON.stringify(bookData, null, 2));

        setBook(bookData);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching book details:", err);
          setError("No s'han pogut carregar els detalls del llibre.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
    return () => controller.abort();
  }, [bookId]);

  // Càlcul totals globals (sense comptar els de baixa)
  let totalExemplars = 0,
    totalExclosos = 0,
    totalNoExclosos = 0;
  if (book && Array.isArray(book.exemplars)) {
    book.exemplars.forEach((e) => {
      if (!e.baixa) {
        totalExemplars++;
        if (e.exclos_prestec) {
          totalExclosos++;
        } else {
          totalNoExclosos++;
        }
      }
    });
  }

  // Agrupació per centre
  let centreStats = {};
  if (book && Array.isArray(book.exemplars)) {
    book.exemplars.forEach((e) => {
      // No comptem si està de baixa
      if (!e.baixa && e.centre && e.centre.nom) {
        const nomCentre = e.centre.nom;
        if (!centreStats[nomCentre]) {
          centreStats[nomCentre] = { exclosos: 0, noExclosos: 0 };
        }
        if (e.exclos_prestec) {
          centreStats[nomCentre].exclosos++;
        } else {
          centreStats[nomCentre].noExclosos++;
        }
      }
    });
  }

  return (
    <div className="container-detail">
      <button onClick={onBack} className="back-btn">
        ← Tornar a la llista
      </button>
      <div className="book-details-card">
        <h2 className="details-title h2">Detalls del llibre</h2>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargant detalls...</p>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : book ? (
          <div className="book-info-details">
            <h3 className="book-title-details h3">{book.titol}</h3>
            <div className="book-metadata">
              <div className="metadata-item">
                <span>ID:</span> {book.id}
              </div>
              <div className="metadata-item">
                <span>Autor:</span> {book.autor || "No especificat"}
              </div>
              {book.editorial && (
                <div className="metadata-item">
                  <span>Editorial:</span> {book.editorial}
                </div>
              )}
              {book.ISBN && (
                <div className="metadata-item">
                  <span>ISBN:</span> {book.ISBN}
                </div>
              )}
              {book.titol_original && (
                <div className="metadata-item">
                  <span>Títol original:</span> {book.titol_original}
                </div>
              )}
              {book.colleccio && (
                <div className="metadata-item">
                  <span>Colecció:</span> {book.colleccio}
                </div>
              )}
              {book.data_edicio && (
                <div className="metadata-item">
                  <span>Data d'edició:</span>{" "}
                  {new Date(book.data_edicio).toLocaleDateString()}
                </div>
              )}
              {book.pagines && (
                <div className="metadata-item">
                  <span>Páginas:</span> {book.pagines}
                </div>
              )}
              {book.llengua?.nom && (
                <div className="metadata-item">
                  <span>Idioma:</span> {book.llengua.nom}
                </div>
              )}
              {book.pais?.nom && (
                <div className="metadata-item">
                  <span>País:</span> {book.pais.nom}
                </div>
              )}
            </div>
            {book.resum && (
              <div className="book-description">
                <h4>Resum:</h4>
                <p>{book.resum}</p>
              </div>
            )}
            {book.anotacions && (
              <div className="book-notes">
                <h4>Anotacions:</h4>
                <p>{book.anotacions}</p>
              </div>
            )}
            {book.thumbnail_url && (
              <div className="book-cover">
                <img
                  src={book.thumbnail_url}
                  alt={`Portada de ${book.titol}`}
                />
              </div>
            )}
            {book.info_url && (
              <div className="book-links">
                <a
                  href={book.info_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  Més informació
                </a>
              </div>
            )}

            {/* Secció extra: Mostrem els totals i detalls per centre */}
            <div className="extra-info">
              {/* <h4>Detalls dels exemplars</h4> */}
              {/* <p>Total exemplars (sense baixa): {totalExemplars}</p>
            <p>Exclosos: {totalExclosos} | No exclosos: {totalNoExclosos}</p> */}

              <h5>Exemplars disponiblen en cada centre:</h5>
              {Object.keys(centreStats).length > 0 ? (
                <ul>
                  {Object.entries(centreStats).map(([centre, stats]) => (
                    <li key={centre}>
                      {centre}:{" "}
                      <span style={{ color: "red" }}>
                        Exclosos: {stats.exclosos}
                      </span>{" "}
                      |{" "}
                      <span style={{ color: "green" }}>
                        No exclosos: {stats.noExclosos}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hi ha exemplars disponibles per cap centre.</p>
              )}
              {extraProp && (
                <p className="extra-prop">Prop extra: {extraProp}</p>
              )}
            </div>

            {/* Botó només per a bibliotecaris */}
            {userRole === "bibliotecario" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "2rem",
                }}
              >
                <button
                  onClick={() =>
                    onCrearPrestac && onCrearPrestac(bookId, book.titol)
                  }
                  //className="bg-blue-600 text-white py-3 px-6 text-base rounded-lg hover:bg-blue-700 cursor-pointer"
                  style={{
                    backgroundColor: "#007BFF",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  Fer préstec
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="error-message">
            No s'ha trobat informació per a aquest llibre.
          </p>
        )}
      </div>
    </div>
  );
}

export default BookDetails;

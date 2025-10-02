function BookItem({ book, onSelect, totalExemplars }) {

  return (
    <div className="book-card">
      <h3 className="book-title h3">{book.titol}</h3>

      <div className="book-info">
        <p className="book-author">
          <span>Autor:</span> {book.autor || "No especificat"}
        </p>
        {book.editorial && (
          <p className="book-editorial">
            <span>Editorial:</span> {book.editorial}
          </p>
        )}
        {book.ISBN && (
          <p className="book-isbn">
            <span>ISBN:</span> {book.ISBN}
          </p>
        )}

        {/* Mostramos total d'exemplars disponibles */}
        <p className="book-available">
          <span>Exemplars disponibles:</span> {totalExemplars}
        </p>
      </div>

      <button 
        className="view-details-btn" 
        onClick={() => onSelect(book.id)}
      >
        Veure detalls
      </button>

    </div>
  );
}

export default BookItem;
import React, { useState, useEffect } from "react";
import Header from "../components/Header";

function PrestacUsuario({ username }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const fetchLoans = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/prestecs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const sortedLoans = data.sort((a, b) => {
        const dateA = a.data_retorn
          ? new Date(a.data_retorn)
          : new Date(a.data_prestec);
        const dateB = b.data_retorn
          ? new Date(b.data_retorn)
          : new Date(b.data_prestec);
        return dateB - dateA;
      });
      setLoans(sortedLoans);
    } catch (err) {
      setError(err.message || "Error en obtenir els préstecs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [username]);

  const getRowStyle = (loan) => {
    const today = new Date();
    const startDate = new Date(loan.data_prestec);
    if (!loan.data_retorn) return { color: "red" };
    const endDate = new Date(loan.data_retorn);
    return { color: today >= startDate && today <= endDate ? "green" : "red" };
  };

  // Paginació
  const totalPages = Math.ceil(loans.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLoans = loans.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div
      className="container"
      style={{
        position: "relative",
        paddingBottom: "120px",
      }}
    >
      <Header level={1} estilo={{ marginBottom: "20px" }}>
        Préstecs de {username}
      </Header>

      {loading && <p>Carregant...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && loans.length > 0 && (
        <>
          {/* Contenedor de la tabla */}
          <div style={{ overflowX: "auto" }}>
            <table className="table" cellPadding="20" cellSpacing="0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Data de préstec</th>
                  <th>Data de retorn</th>
                  <th>Anotacions</th>
                  <th>Títol de l'exemplar</th>
                </tr>
              </thead>
              <tbody>
                {currentLoans.map((loan, index) => (
                  <tr key={loan.id} style={getRowStyle(loan)}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{loan.id}</td>
                    <td>{loan.data_prestec}</td>
                    <td>{loan.data_retorn || "No retornat"}</td>
                    <td>{loan.anotacions || "-"}</td>
                    <td>{loan.exemplar_titol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && !error && loans.length === 0 && (
        <p>No s'han trobat préstecs per a aquest usuari.</p>
      )}

      {/* Paginador fijo en la parte inferior */}
      <div
        className="pagination-container"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "5px",
          padding: "10px",
          background: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
          borderRadius: "4px",
          zIndex: 1000,
        }}
      >
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            className="paginator-button "
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            style={{
              padding: "8px 12px",
              backgroundColor:
                currentPage === i + 1 ? "var(--button-bg)" : "#e0e0e0",
              color: currentPage === i + 1 ? "var(--navbar-text)" : "#000",
              borderColor: currentPage === i + 1 ? "var(--button-bg)" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PrestacUsuario;

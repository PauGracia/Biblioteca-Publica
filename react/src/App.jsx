import { useState, useEffect } from "react";
import "./styles.css";
import "./styles/tailwind.css";

import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Prestacs from "./pages/Prestacs";
import PrestacUsuario from "./pages/PrestacUsuario";
import Exemplars from "./pages/Exemplars";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import BookList from "./components/BookList";
import BookDetails from "./components/BookDetails";
import CsvUpload from "./components/CsvUpload";
import CrearPrestac from "./components/CrearPrestac";
import CarritoExemplars from "./components/CarritoExemplars";

//import gifBanner from "./assets/gifP3.gif";
import gifBanner from "./assets/gif1.webp";

function App() {
  // Estados generales
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [page, setPage] = useState("bookList");
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [crearPrestacBookId, setCrearPrestacBookId] = useState(null);
  const [crearPrestacBookTitle, setCrearPrestacBookTitle] = useState("");

  // Navegación
  const handleNavigateToEditProfile = () => setPage("Perfil");
  const handleNavigateToSeeLandingPage = () => setPage("bookList");
  const handleNavigateToLoginPage = () => setPage("login");
  const handleNavigateToCSVPage = () => setPage("CSV");
  const handleNavigateToPrestacPage = () => setPage("Prestac");
  const handleNavigateToExemplars = () => setPage("exemplars");
  const handleNavigateToCarrito = () => setPage("carrito");

  const handleSelectBook = (bookId) => {
    setSelectedBookId(bookId);
    setPage("detail");
  };
  const handleBackFromDetails = () => {
    setSelectedBookId(null);
    setPage("bookList");
  };

  const handleAbrirCrearPrestac = (bookId, bookTitle) => {
    setCrearPrestacBookId(bookId);
    setCrearPrestacBookTitle(bookTitle);
    setPage("CrearPrestac");
  };

  const handleLogout = () => {
    localStorage.clear();
    setAuthenticated(false);
    setToken("");
    setRole("");
    setUser("");
    setGrupos([]);
    setPage("bookList");
  };

  // Cargar estado desde localStorage al montar
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("username");

    if (storedToken && storedRole && storedUser) {
      setToken(storedToken);
      setRole(storedRole);
      setUser(storedUser);
      setAuthenticated(true);
    }
  }, []);

  // Redirigir admin
  useEffect(() => {
    if (role === "admin") {
      window.location.href = "http://127.0.0.1:8000/admin";
    }
  }, [role]);

  return (
    <>
      {/* Navbar siempre visible */}
      <Navbar
        user={user}
        role={role}
        onLogout={handleLogout}
        onLoginClick={handleNavigateToLoginPage}
        onCatalagClick={handleNavigateToSeeLandingPage}
        onPerfilClick={handleNavigateToEditProfile}
        isToken={!!token}
      />

      {/* Sidebar solo para bibliotecari o usuari */}
      {isAuthenticated && (role === "bibliotecari" || role === "usuari") && (
        <Sidebar
          isToken={!!token}
          role={role}
          onPrestacClick={handleNavigateToPrestacPage}
          onExemplarsClick={handleNavigateToExemplars}
          onCSVClick={handleNavigateToCSVPage}
        />
      )}

      {/* Contenido principal */}
      <div className="main">
        {!isAuthenticated && page === "login" && (
          <Login
            setAuthenticated={setAuthenticated}
            setToken={setToken}
            setUser={setUser}
            setRole={setRole}
            setGrupos={setGrupos}
            setPage={setPage}
            onCatalagClick={handleNavigateToSeeLandingPage}
            backToLogin={handleNavigateToSeeLandingPage}
          />
        )}

        {!isAuthenticated && page === "bookList" && (
          <BookList onSelectBook={handleSelectBook} />
        )}

        {isAuthenticated && page === "bookList" && (
          <BookList onSelectBook={handleSelectBook} />
        )}

        {page === "Prestac" &&
          isAuthenticated &&
          (role === "bibliotecari" ? (
            <Prestacs username={user} />
          ) : (
            <PrestacUsuario username={user} />
          ))}

        {page === "CSV" && <CsvUpload />}
        {page === "Perfil" && (
          <Perfil username={user} onBack={handleNavigateToSeeLandingPage} />
        )}
        {page === "detail" && (
          <BookDetails
            bookId={selectedBookId}
            onBack={handleBackFromDetails}
            userRole={role}
            onCrearPrestac={handleAbrirCrearPrestac}
          />
        )}
        {page === "CrearPrestac" && (
          <CrearPrestac
            bookId={crearPrestacBookId}
            bookTitle={crearPrestacBookTitle}
            onBack={() => setPage("detail")}
          />
        )}
        {page === "exemplars" && (
          <Exemplars goToCarrito={handleNavigateToCarrito} />
        )}
        {page === "carrito" && (
          <CarritoExemplars goToExemplars={handleNavigateToExemplars} />
        )}
      </div>

      {/* Banner */}
      <a
        href="https://www.iesesteveterradas.cat/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={gifBanner}
          alt="GIF de final de página"
          className="gif-banner"
        />
      </a>
    </>
  );
}

export default App;

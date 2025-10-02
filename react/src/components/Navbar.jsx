import { Link } from 'react-router-dom';
import { useState } from 'react';
import Button from './Button';
import ThemeToggle from './ThemeToggle';

function Navbar({user, changeToken,onLoginClick, onPerfilClick, setAuthenticated, onCatalagClick, style, isToken, setRole, ...others }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    // Eliminar el token, actualizar estado y cerrar el menú
    localStorage.removeItem('authToken');
    setAuthenticated(false);
    setMenuOpen(false);
    changeToken(false)

    console.log("token borrado: ",changeToken, "   token :    ",isToken)
   
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };



  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          Biblioteca Maricarmen Brito
        </Link>

        {isToken && user && (
        <li className="nav-item list-none">
          <span className="user-greeting">
            Hola, {user}
          </span>
        </li>
      )}







        <div className="menu-icon" onClick={toggleMenu}>
          <div className={menuOpen ? 'hamburger open' : 'hamburger'}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={menuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            {/* Botón para ir al catálogo / inicio */}
            <Button
              text="Inici"
              onClick={() => {
                setMenuOpen(false);
                onCatalagClick();
              }}
            />
          </li>

          {isToken ? (
            <>
              <li className="nav-item">
                {/* Botón para ir a Perfil */}
                <Button
                  text="Perfil"
                  onClick={() => {
                    setMenuOpen(false);
                    onPerfilClick();
                  }}
                />
              </li>

              <li className="nav-item">
                
                <Button
                  text="Tancar Sessió"
                  onClick={() => {
                    handleLogout();
                    onCatalagClick();
                  }}
                />
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                {/* Botón para Iniciar Sesión */}
                <Button
                  text="Iniciar Sessió"
                  onClick={() => {
                    setMenuOpen(false);
                    onLoginClick();
                  }}
                />
              </li>
            </>
          )}
          {/* Theme toggle */}
          <li className="nav-item">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

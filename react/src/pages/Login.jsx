// src/pages/Login.jsx
import { useState, useEffect } from "react";
import LabelInput from "../components/LabelInput";
import Button from "../components/Button";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import Sidebar from "../components/Sidebar";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function Login({
  setAuthenticated,
  setUser,
  setRole,
  setGrupos,
  setToken,
  goToCatalag,
  backToLogin,
}) {
  console.log("Login iniciat ...");

  const [username, setUsernameLocal] = useState("");
  const [password, setPasswordLocal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [localGrupos, setLocalGrupos] = useState([]);

  // Cargar credenciales desde localStorage
  useEffect(() => {
    console.log("Cargando credenciales de localStorage");
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    if (storedUsername && storedPassword) {
      setUsernameLocal(storedUsername);
      setPasswordLocal(storedPassword);
    }
  }, []);

  useEffect(() => {
    console.log("Grups actualitzats:", localGrupos);
  }, [localGrupos]);

  const handleSaveCredentials = () => {
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    console.log("Credencials guardades:", { username, password });
  };

  const handleLogin = async () => {
    console.log("Botó de login clickat");
    handleSaveCredentials();

    try {
      console.log("Enviant sol·licitud amb:", { username, password });
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Respuesta de login:", data);

      if (data.exists) {
        console.log("Grupos del usuario:", data.grupos);
        setLocalGrupos(data.grupos);
        setUser(username);
        setAuthenticated(true);
        setGrupos(data.grupos);

        // Asignar token y mostrarlo
        const receivedToken = data.token; // Aquí supongo que el token viene en data.token
        console.log("Token recibido:", receivedToken);
        setToken(receivedToken); // Guardar el token en el estado local

        localStorage.setItem("authToken", receivedToken);

        // Definir el rol según los grupos del usuario
        if (data.grupos.includes("Admin")) {
          setRole("admin");
          setErrorMessage("");
        } else if (data.grupos.includes("Bibliotecario")) {
          setRole("bibliotecario");
          setErrorMessage("");
        } else if (data.grupos.includes("usuari")) {
          setRole("usuari");
          setErrorMessage("");
        } else {
          setRole("guest");
          setErrorMessage("");
        }

        backToLogin();
      } else {
        throw new Error("Usuario no encontrado");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setErrorMessage(error.message);
      setAuthenticated(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: "80px", width: "700px" }}>
      <Header level={1}>Login</Header>
      <LabelInput
        label="Nom d'usuari"
        type="text"
        value={username}
        placeholder="Introduïu el vostre nom d'usuari"
        onChange={(e) => setUsernameLocal(e.target.value)}
        autoComplete="username"
      />
      <br />
      <LabelInput
        label="Contrasenya"
        type="password"
        value={password}
        placeholder="Introdueix la teva contrasenya"
        onChange={(e) => setPasswordLocal(e.target.value)}
        autoComplete="current-password"
      />
      <Button
        text="Inicia sessió"
        onClick={handleLogin}
        className="login-button"
      />
      {errorMessage && (
        <Paragraph style={{ color: "red" }}>{errorMessage}</Paragraph>
      )}
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log("Login Google exitoso:", credentialResponse);
          const decoded = jwtDecode(credentialResponse.credential);
          console.log("Datos del usuario Google:", decoded);

          setUser(decoded.email || decoded.name);
          setAuthenticated(true);
          setRole("usuari");
          setToken(credentialResponse.credential);
          localStorage.setItem("authToken", credentialResponse.credential);
          backToLogin();
        }}
        onError={() => {
          console.log("Error al iniciar sesión con Google");
          setErrorMessage("Error al iniciar sesión con Google");
        }}
        theme="outline"
        size="large"
        text="signin_with"
        shape="rectangular"
        logo_alignment="left"
        width="300"
      />
    </div>
  );
}

export default Login;

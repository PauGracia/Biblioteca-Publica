import { useState, useEffect } from "react";
import LabelInput from "../components/LabelInput";
import Button from "../components/Button";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function Login({
  setAuthenticated,
  setUser,
  setRole,
  setGrupos,
  setToken,
  backToLogin,
}) {
  console.log("Login iniciat ...");

  const [username, setUsernameLocal] = useState("");
  const [password, setPasswordLocal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [localGrupos, setLocalGrupos] = useState([]);

  // Cargar credenciales guardadas
  /*useEffect(() => {
    console.log("Cargando credenciales de localStorage");
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    if (storedUsername && storedPassword) {
      setUsernameLocal(storedUsername);
      setPasswordLocal(storedPassword);
    }
  }, []);*/

  useEffect(() => {
    console.log("Grups actualitzats:", localGrupos);
  }, [localGrupos]);

  const handleSaveCredentials = () => {
    localStorage.setItem("username", username);
    //localStorage.setItem("password", password);

    console.log("Credencials guardades:", { username, password });
  };

  // FUNCIÓN DE LOGIN PRINCIPAL
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
        // Guardar grupos y token
        const grupos = data.grupos.map((g) => g.toLowerCase());
        const receivedToken = data.token || "tempToken"; // evita null

        console.log("Grupos del usuario:", grupos);
        console.log("Token recibido:", receivedToken);

        // Determinar el rol según los grupos
        let roleValue = "guest";
        if (grupos.includes("admin")) roleValue = "admin";
        else if (grupos.includes("bibliotecari")) roleValue = "bibliotecari";
        else if (grupos.includes("usuari")) roleValue = "usuari";

        // Login.jsx después del login exitoso
        // Guardar en estados
        setLocalGrupos(grupos);
        setGrupos(grupos);
        setUser(username);
        setToken(receivedToken); // React ve el cambio de token
        setRole(roleValue); // React ve el cambio de rol
        setAuthenticated(true);

        // Guardar en localStorage
        localStorage.setItem("authToken", receivedToken);
        localStorage.setItem("username", username);
        localStorage.setItem("role", roleValue);

        setErrorMessage("");

        // Redirigir sin retraso
        //setPage("bookList"); // en lugar de backToLogin()
        backToLogin();

        // Espera un tick antes de redirigir (para que React actualice)
        setTimeout(() => {
          console.log("✅ Rol asignado:", roleValue);
          backToLogin();
        }, 0);
      } else {
        throw new Error("Usuari no trobat");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setErrorMessage(error.message);
      setAuthenticated(false);
    }
  };

  // LOGIN GOOGLE
  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Login Google exitoso:", credentialResponse);
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Datos del usuario Google:", decoded);

    setUser(decoded.email || decoded.name);
    setAuthenticated(true);
    setRole("usuari");
    setToken(credentialResponse.credential);
    localStorage.setItem("authToken", credentialResponse.credential);
    localStorage.setItem("role", "usuari");
    localStorage.setItem("username", decoded.email || decoded.name);
    backToLogin();
  };

  const handleGoogleError = () => {
    console.log("Error al iniciar sesión con Google");
    setErrorMessage("Error al iniciar sesión con Google");
  };

  // RENDER
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
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
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

import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const GoogleLoginButton = ({ onLoginSuccess, onLoginError }) => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse.credential;
      if (!credential) throw new Error("No credential received");

      // Decodificar el token para extraer la información (opcional)
      const decoded = jwtDecode(credential);
      console.log("Google User Data:", decoded);

      // Enviar el token al backend para validarlo
      const response = await fetch("https://biblioteca5.ieti.site/api/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential })
      });

      if (!response.ok) throw new Error("Auth failed");
      const data = await response.json();
      console.log("Backend response:", data);

      // Si la autenticación es exitosa, manejar la respuesta
      if (data.exists && data.token) {
        onLoginSuccess(data.token, decoded.email || decoded.name, data.grupos);
      } else {
        throw new Error("No se pudo autenticar con Google");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      onLoginError(error.message || "Error al autenticar con Google");
    }
  };

  return (
    <div style={{ margin: "20px 0", display: "flex", justifyContent: "center" }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.error("Google Login Failed")}
        useOneTap={false}
        ux_mode="popup"
        theme="filled_blue"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="300"
        logo_alignment="left"
      />
    </div>
  );
};

export default GoogleLoginButton;

// Perfil.js
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import EditarPerfil from "./EditarPerfil"; // Asegúrate de que la ruta sea correcta

function Perfil({ username, onBack }) {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  console.log("entramos en perfil");

  useEffect(() => {
     fetch("https://biblioteca5.ieti.site/api/perfil/", {
    //fetch("http://127.0.0.1:8000/api/perfil/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en carregar perfil");
        return res.json();
      })
      .then((data) => {
        setProfileData(data);
        console.log("imatge carregada :", data.imatge);
        setFormData(data); // Guardamos todos los datos, pero solo se editarán imagen, email y teléfono
      })
      .catch((err) => setError(err.message));
  }, [username]);

  // Actualiza los campos editables (imagen, email, y teléfono)
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Al guardar, se envían solo los campos editables junto con el identificador (username)
  const handleSave = async () => {
    setMessage("");
    console.log("imatge enviada: ", formData.imatge);
    const dataToSend = {
      username: profileData.username,
      imatge: formData.imatge,
      email: formData.email,
      telefon: formData.telefon,
    };

    try {
       const res = await fetch("https://biblioteca5.ieti.site/api/verificar-cambios/", {
      //const res = await fetch("http://127.0.0.1:8000/api/verificar-cambios/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (data.modified) {
         await fetch("https://biblioteca5.ieti.site/api/perfil/", {
        //await fetch("http://127.0.0.1:8000/api/perfil/", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
      
        setMessage("Perfil actualitzat correctament.");
      } else {
        setMessage("No hi ha canvis per desar.");
      }
    } catch (err) {
      setMessage("Error al actualizar el perfil.");
    }
  };

  if (error) {
    return (
      <div>
        <Paragraph style={{ color: "red" }}>{error}</Paragraph>
        <Button text="Volver" onClick={onBack} />
      </div>
    );
  }
  if (!profileData) return <Paragraph>Carregant perfil...</Paragraph>;

  return (
    <div className="container">
      <Header level={1}>Edita perfil de {profileData.username}</Header>

      {/* Componente para editar imagen, email y teléfono */}
      <EditarPerfil
        formData={formData}
        onChange={handleChange}
        onSave={handleSave}
        message={message}
      />

      <Button
        text="Volver"
        onClick={onBack}
        style={{
          position: "fixed",
          top: 30,
          left: 30,
          width: "100px",
        }}
      />
    </div>
  );
}

export default Perfil;

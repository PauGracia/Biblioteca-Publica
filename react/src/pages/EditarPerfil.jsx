import React, { useState, useEffect, useRef } from "react";
import LabelInput from "../components/LabelInput";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";

function EditarPerfil({ formData, onChange, onSave, message }) {
  const [errors, setErrors] = useState({});
  const [visibleMessage, setVisibleMessage] = useState("");
  const fileInputRef = useRef(null);

  // Determina la URL que se mostrará en el <img>
  const imgSrc = formData.imatge
    ? formData.imatge.startsWith("data:")
      ? formData.imatge
      : `http://127.0.0.1:8000${formData.imatge}`
    : null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ target: { name: "imatge", value: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    const newErrors = {};
    const phoneRegex = /^[0-9]*$/;
    if (formData.telefon && !phoneRegex.test(formData.telefon)) {
      newErrors.telefon = "El camp Telèfon només pot contenir números.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "El format de correu electrònic no és vàlid.";
    }
    setErrors(newErrors);
  }, [formData.telefon, formData.email]);

  useEffect(() => {
    if (message) {
      setVisibleMessage(message);
      const timeout = setTimeout(() => {
        setVisibleMessage("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <div>
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="Imatge de perfil"
          width="100"
          height="100"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "1em",
            cursor: "pointer",
          }}
          onClick={handleImageClick}
        />
      ) : (
        <p
          style={{ cursor: "pointer", marginBottom: "1em" }}
          onClick={handleImageClick}
        >
          No hi ha imatge de perfil, fes clic per afegir-la
        </p>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <LabelInput
        label="Email:"
        name="email"
        value={formData.email || ""}
        onChange={onChange}
      />
      {errors.email && (
        <Paragraph style={{ color: "red", fontSize: "0.9em" }}>
          {errors.email}
        </Paragraph>
      )}

      <LabelInput
        label="Teléfono:"
        name="telefon"
        value={formData.telefon || ""}
        onChange={onChange}
      />
      {errors.telefon && (
        <Paragraph style={{ color: "red", fontSize: "0.9em" }}>
          {errors.telefon}
        </Paragraph>
      )}

      {visibleMessage && (
        <Paragraph style={{ color: "green", marginTop: "1em" }}>
          {visibleMessage}
        </Paragraph>
      )}

      <Button
        text="Guardar cambios"
        onClick={onSave}
        disabled={Object.keys(errors).length > 0}
      />
    </div>
  );
}

export default EditarPerfil;

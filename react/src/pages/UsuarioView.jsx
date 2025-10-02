import React from "react";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";

function UsuariView({ username, grupos,  }) {
    return (
      <div>
        <Header level={2}>Hola, {username} (Usuari)</Header>
        <Paragraph>Grups: {grupos.join(", ")}</Paragraph>
      </div>
    );
  }
  
  export default UsuariView;
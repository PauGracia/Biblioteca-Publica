import React from "react";
import Button from "./Button";

function Sidebar({
  onCSVClick,
  onPrestacClick,
  setAuthenticated,
  style,
  onExemplarsClick,
  isToken,
  role,
  ...others
}) {
  return (
    <div className="sidebar">
      <div
        style={{
          position: "fixed",
          top: 70, // para no tapar la navbar
          left: 0,
          width: "130px",
          height: "100%", // altura completa del viewport
          backgroundColor: "rgba(63, 94, 153, 0.9)", // corregido: faltaba un número
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          padding: "10px",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 999,
          marginRight: "10px",
        }}
        {...others}
      >
        {/* div para crear espacio en la parte superior */}
        <div style={{ height: "20px" }}></div>
        {isToken && role === "bibliotecari" && (
          <>
            <div className="sidebarButton">
              <Button text="Carrega de perfils en CSV" onClick={onCSVClick} />
            </div>

            <div className="sidebarButton">
              <Button text="Cercar exemplars" onClick={onExemplarsClick} />
            </div>
          </>
        )}
        {isToken && (
          <div className="sidebarButton">
            <Button text="Préstecs" onClick={onPrestacClick} />
          </div>
        )}
        {/* Aquí puedes añadir más opciones del sidebar si lo deseas */}
      </div>
    </div>
  );
}

export default Sidebar;

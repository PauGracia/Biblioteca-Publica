import React from "react";
import Button from "./Button";

function Sidebar({
  onCSVClick,
  onPrestacClick,
  setAuthenticated,
  onExemplarsClick,
  isToken,
  role,
  ...others
}) {
  return (
    <div className="sidebar" {...others}>
      <div className="sidebar-container">
        {/* espacio arriba */}
        <div className="sidebar-top-space"></div>

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
      </div>
    </div>
  );
}

export default Sidebar;

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function Modal({ children, isOpen, duration = 3000, onClose }) {
  const dialog = useRef(null);

  useEffect(() => {
    let timer;
    if (isOpen) {
      // Abrir el dialog
      dialog.current.showModal();
      // Cierra el dialog después de 'duration' milisegundos
      timer = setTimeout(() => {
        dialog.current.close();
        // Si se pasa un callback onClose, se ejecuta al cerrar.
        if (onClose) onClose();
      }, duration);
    } else {
      dialog.current.close();
    }
    // Limpiar el temporizador si el componente se desmonta o cambia isOpen
    return () => timer && clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}

export default Modal;

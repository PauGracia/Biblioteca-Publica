import React, { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

async function fetchImageAsDataURL(url) {
  const response = await fetch(url, { mode: "cors" });
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export default function ImprimirExemplars({ items, onPrint }) {
  const printRef = useRef(null);
  const [itemsWithCdu, setItemsWithCdu] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const updated = await Promise.all(
        items.map(async (it) => {
          try {
            const res = await fetch(
              `http://127.0.0.1:8000/api/get_cdu?registre=${encodeURIComponent(
                it.registre
              )}`
            );
            if (!res.ok) throw new Error();
            const { cdu } = await res.json();
            return { ...it, cdu };
          } catch {
            return { ...it, cdu: "—" };
          }
        })
      );
      if (mounted) setItemsWithCdu(updated);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [items]);

  const pageSize = 34;
  const pages = [];
  for (let i = 0; i < itemsWithCdu.length; i += pageSize)
    pages.push(itemsWithCdu.slice(i, i + pageSize));
  const totalPages = pages.length;

  function buildTableDOM(slice) {
    const table = document.createElement("table");
    table.className = "labelsTable";
    table.style.border = "none";
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";

    const tbody = document.createElement("tbody");
    for (let r = 0; r < 17; r++) {
      const tr = document.createElement("tr");
      const rowItems = slice.slice(r * 2, r * 2 + 2);
      rowItems.forEach((item) => {
        const td1 = document.createElement("td");
        td1.className = "border p-2";
        td1.style.border = "none";
        td1.innerHTML = `
          <div class="labelCenter">${item.centre.nom}</div>
          <img class="barcodeImg" crossOrigin="anonymous"
               src="https://api-bwipjs.metafloor.com/?bcid=code128&text=${encodeURIComponent(
                 item.registre
               )}&includetext=false&scale=2&height=10"/>
          <div class="labelCenter">${item.registre}</div>
        `;
        tr.appendChild(td1);
        const td2 = document.createElement("td");
        td2.className = "border p-2";
        td2.style.border = "none";
        td2.innerHTML = `
          <div class="labelCdu">CDU:</div>
          <div class="labelCDU">${item.cdu}</div>
        `;
        tr.appendChild(td2);
      });
      if (rowItems.length < 2) {
        const e1 = document.createElement("td");
        e1.className = "emptyCell";
        e1.style.border = "none";
        const e2 = document.createElement("td");
        e2.className = "emptyCell";
        e2.style.border = "none";
        tr.append(e1, e2);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return table;
  }

  const handleDownload = async () => {
    if (!pages.length || downloading) return;
    setDownloading(true);
    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = "wait";
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const marginX = 0.8,
        marginY = 0.6;
      const pageW = 210,
        pageH = 297;
      const contentW = pageW - marginX * 2,
        contentH = pageH - marginY * 2;

      for (let idx = 0; idx < pages.length; idx++) {
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.width = `${contentW}mm`;
        container.style.padding = `${marginY}mm ${marginX}mm`;
        container.classList.add("theme-light");
        container.classList.remove("theme-dark");
        container.appendChild(buildTableDOM(pages[idx]));
        document.body.appendChild(container);

        const imgs = container.querySelectorAll("img.barcodeImg");
        await Promise.all(
          Array.from(imgs).map(
            (img) =>
              new Promise((res) => {
                img.onload = res;
                img.onerror = res;
              })
          )
        );

        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.8);
        if (idx > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", marginX, marginY, contentW, contentH);
        document.body.removeChild(container);
      }
      pdf.save("etiquetas.pdf");
    } finally {
      document.body.style.cursor = prevCursor || "";
      setDownloading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="ml-3 text-lg">Cargando etiquetas...</span>
      </div>
    );

  const renderTable = (slice) => {
    const rows = Array.from({ length: 17 }, (_, r) =>
      slice.slice(r * 2, r * 2 + 2)
    );
    return (
      <table className="labelsTable">
        <tbody>
          {rows.map((rowItems, rowIdx) => (
            <tr key={rowIdx}>
              {rowItems.map((item) => (
                <React.Fragment key={item.id}>
                  <td>
                    <div className="labelCenter">{item.centre.nom}</div>
                    <img
                      className="barcodeImg"
                      crossOrigin="anonymous"
                      src={`https://api-bwipjs.metafloor.com/?bcid=code128&text=${encodeURIComponent(
                        item.registre
                      )}&includetext=false&scale=2&height=10`}
                      alt="Codi de barres"
                    />
                    <div className="labelCenter">{item.registre}</div>
                  </td>
                  <td>
                    <div className="labelCdu">CDU:</div>
                    <div className="labelCDU">{item.cdu}</div>
                  </td>
                </React.Fragment>
              ))}
              {rowItems.length < 2 && (
                <>
                  <td className="emptyCell" />
                  <td className="emptyCell" />
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="batch-actions flex space-x-2 mb-4">
        <button
          onClick={handleDownload}
          className="print-btn"
          disabled={downloading}
        >
          {downloading ? "Generant..." : "Descarregar PDF"}
        </button>
        {onPrint && (
          <button onClick={onPrint} className="print-btn">
            Tornar a la llista
          </button>
        )}
      </div>
      <div className="pagination-controls flex justify-center items-center space-x-4 mb-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
          className="print-btn"
        >
          Anterior
        </button>
        <span>
          Página {currentPage + 1} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
          className="print-btn"
        >
          Siguiente
        </button>
      </div>
      <div ref={printRef} className="printPage">
        {pages[currentPage] && renderTable(pages[currentPage])}
      </div>
    </div>
  );
}

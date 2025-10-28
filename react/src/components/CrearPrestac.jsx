import { useState, useEffect } from "react";
import LabelInput from "./LabelInput";
import Button from "./Button";

function CrearPrestac({ bookId, bookTitle, onBack }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [exemplars, setExemplars] = useState([]);
  const [selectedExemplar, setSelectedExemplar] = useState(null);
  const [message, setMessage] = useState("");
  const [reservaFecha, setReservaFecha] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [loading, setLoading] = useState({
    users: false,
    exemplars: false,
    creating: false,
  });

  //estado fecha
  const [retornFecha, setRetornFecha] = useState(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return nextWeek.toISOString().split("T")[0];
  });

  // Función para crear el préstamo
  const handleCrearPrestac = async () => {
    if (!selectedUser || !selectedExemplar || !reservaFecha) {
      setMessage("Si us plau, completa tots els camps");
      return;
    }

    const selectedDate = new Date(reservaFecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reseteamos la hora

    if (selectedDate < today) {
      setMessage("La data no pot ser anterior al dia actual");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, creating: true }));
      setMessage("Creant préstec...");

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token no disponible. Inicia sessió.");
      }

      const response = await fetch("http://127.0.0.1:8000/api/crear_prestec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuari: selectedUser.id,
          exemplar: selectedExemplar.id,
          data_prestec: reservaFecha,
          data_retorn: retornFecha,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en crear el préstec");
      }

      setMessage("✅ Préstec creat correctament");
      setSelectedExemplar(null);
      setReservaFecha("");
    } catch (error) {
      console.error("Error:", error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, creating: false }));
    }
  };

  // Buscar usuario cuando se ingresa texto en el campo de búsqueda
  useEffect(() => {
    const buscarUsuario = async () => {
      if (!search.trim()) {
        setFilteredUsers([]);
        setMessage("");
        return;
      }

      try {
        setLoading((prev) => ({ ...prev, users: true }));

        const response = await fetch(
          "http://127.0.0.1:8000/api/buscar_usuarios/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: search.trim() }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.log("Error Response:", errorData);
          setMessage("Error en cercar l'usuari");
          return;
        }

        const user = await response.json();
        setFilteredUsers(user);
        setMessage("");
      } catch (error) {
        console.error("Error en cercar l'usuari:", error);
        setFilteredUsers([]);
        setMessage("Usuari no trobat");
      } finally {
        setLoading((prev) => ({ ...prev, users: false }));
      }
    };

    buscarUsuario();
  }, [search]);

  // Buscar ejemplares del libro
  useEffect(() => {
    if (!bookId) return;

    const fetchExemplars = async () => {
      setLoading((prev) => ({ ...prev, exemplars: true }));
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/llibres/${bookId}/exemplars`
        );
        const data = await response.json();
        const disponibles = data.filter((e) => !e.exclos_prestec);
        setExemplars(disponibles);
      } catch (error) {
        console.error("Error:", error);
        setMessage(`Error en carregar exemplars: ${error.message}`);
      } finally {
        setLoading((prev) => ({ ...prev, exemplars: false }));
      }
    };
    fetchExemplars();
  }, [bookId]);

  useEffect(() => {
    setSelectedUser(null);
  }, [search]);

  return (
    <>
      <div className="container-books">
        <div className="crear-prestec-wrapper">
          <h3 className="crear-prestec-title">Crear préstec</h3>

          <h2 className="crear-prestec-booktitle">{bookTitle}</h2>

          {/* Buscador de usuarios */}
          <div className="mb-6">
            <LabelInput
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca usuari..."
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Lista de usuarios */}
          {loading.users ? (
            <p>Carregant usuaris...</p>
          ) : (
            filteredUsers.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-blue-600">
                  Usuaris:
                </h2>
                <div className="max-h-60 overflow-y-auto border rounded">
                  {filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUser(u)}
                      className={`p-3 hover:bg-gray-100 cursor-pointer ${
                        selectedUser?.id === u.id
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                    >
                      <p className="font-medium text-black">
                        {u.first_name} {u.last_name}
                      </p>
                      <p className="text-sm text-black">
                        {u.username} | {u.email}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {selectedUser && (
            <>
              <div className="mb-4 p-2 border rounded bg-blue-50">
                <p className="font-semibold text-blue-600">
                  Usuaris seleccionats:
                </p>
                <p className="text-black">
                  {selectedUser.first_name} {selectedUser.last_name} -{" "}
                  {selectedUser.email}
                </p>
                <p className="text-black">Telèfon: {selectedUser.telefon}</p>
                {selectedUser.centre && (
                  <p className="text-black">Centra: {selectedUser.centre}</p>
                )}
              </div>

              <div className="mb-6 relative z-10">
                <label className="block text-lg font-semibold mb-2 text-blue-600">
                  Data de préstec:
                </label>
                <input
                  type="date"
                  value={reservaFecha}
                  onChange={(e) => setReservaFecha(e.target.value)}
                  className="w-full p-2 border rounded"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="mb-6 relative z-10">
                <label className="block text-lg font-semibold mb-2 text-blue-600">
                  Data de retorn prevista:
                </label>
                <input
                  type="date"
                  value={retornFecha}
                  onChange={(e) => setRetornFecha(e.target.value)}
                  className="w-full p-2 border rounded"
                  min={reservaFecha || new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Ejemplares y fecha */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-blue-600">
                  Exemplars disponibles:
                </h2>
                {loading.exemplars ? (
                  <p>Carregant exemplars...</p>
                ) : exemplars.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {exemplars.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => setSelectedExemplar(e)}
                        className={`p-3 border rounded cursor-pointer ${
                          selectedExemplar?.id === e.id
                            ? "bg-green-50 border-green-500"
                            : ""
                        }`}
                      >
                        <p className="text-black">Registre: {e.registre}</p>
                        {e.centre && (
                          <p className="text-sm text-black">
                            Centre: {e.centre.nom}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-500">No hi ha exemplars disponibles</p>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  text={loading.creating ? "Creant..." : "Confirmar préstec"}
                  onClick={handleCrearPrestac}
                  disabled={
                    !selectedExemplar || !reservaFecha || loading.creating
                  }
                  className={`${
                    !selectedExemplar || !reservaFecha
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-4 py-2 rounded`}
                />
                <Button
                  text="Tornar"
                  onClick={onBack}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                />
              </div>
            </>
          )}

          {message && (
            <div
              className={`mt-4 p-3 rounded ${
                message.includes("✅")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CrearPrestac;

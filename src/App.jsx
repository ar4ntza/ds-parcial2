import { useState, useEffect } from "react";
import { db } from "./firebase";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function App() {
  const [titulo, setTitulo] = useState("");
  const [tareas, setTareas] = useState([]);

  const tareasRef = collection(db, "tareas");

  // READ: consultar tareas
  async function obtenerTareas() {
    const resultado = await getDocs(tareasRef);

    const datos = resultado.docs.map((documento) => ({
      id: documento.id,
      ...documento.data(),
    }));

    setTareas(datos);
  }

  useEffect(() => {
    obtenerTareas();
  }, []);

  // CREATE: agregar una tarea
  async function agregarTarea(e) {
    e.preventDefault();

    if (!titulo.trim()) return;

    await addDoc(tareasRef, {
      titulo: titulo,
      completada: false,
    });

    setTitulo("");
    obtenerTareas();
  }

  // UPDATE: cambiar el estado de una tarea
  async function completarTarea(tarea) {
    const referencia = doc(db, "tareas", tarea.id);

    await updateDoc(referencia, {
      completada: !tarea.completada,
    });

    obtenerTareas();
  }

  // DELETE: eliminar una tarea
  async function eliminarTarea(id) {
    const referencia = doc(db, "tareas", id);

    await deleteDoc(referencia);
    obtenerTareas();
  }

  return (
    <div>
      <h1>Mis tareas</h1>

      <form onSubmit={agregarTarea}>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Escribe una tarea"
        />

        <button type="submit">Agregar</button>
      </form>

      <ul>
        {tareas.map((tarea) => (
          <li key={tarea.id}>
            <span>
              {tarea.titulo}
              {tarea.completada ? " ✓" : ""}
            </span>

            <button
              onClick={() => completarTarea(tarea)}
            >
              Completar / deshacer
            </button>

            <button
              onClick={() => eliminarTarea(tarea.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

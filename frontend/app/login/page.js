"use client";
import { useState } from "react"; // https://www.w3schools.com/react/react_usestate.asp
import Header from "../../componentes/header";
//import dotenv from "dotenv"; //deben tener el prefijo PUBLIC_ para que next los lea en el frontend

export default function PaginaLogin() {
//dotenv.config(); // cargar las avriables en el.env

const PORT_EXPRESS = process.env.NEXT_PUBLIC_PORT_EXPRESS;

  const [error, setError] = useState(""); // almacenar los errores localmente

  // inicia funcion para manejar el login
  async function enLogin(e) {
    e.preventDefault(); // para que no se recargue la pagina cuando se logea alguien

    // jalar los datos de los inputs
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    console.log("DEBUGEANDO Intentando login con:", { username, password });

    try {
      // fetch al backend para validar si el usuario y su pswd son correctos
      const res = await fetch(`http://localhost:${PORT_EXPRESS}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // convertir a json
      });

      console.log("DEBUGEANDO Respuesta del servidor (status):", res.status);
      // asegurar que la respuesta del backend que viene en data venga en json
      const data = await res.json();
      console.log("DEBUGEANDO Datos recibidos del servidor:", data);  

      if (!res.ok) { // si es diferente de ok (200)
        setError(data.message || "Error en el login");
        return;
      }

      localStorage.setItem("token", data.token); // si el login es ok guiardar el token en localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ username: data.username, role: data.role })
      );

      console.log("DEBUGEANDO Login exitoso usuario guardado en localStorage");
      // y ya hasta el final redirigimos a la pagina principal
      // CAMBIAR ESTO PARA QUE VAYA A LA PAGINA DE ADMIN SI ES ADMIN (aun no hay pagina de admin)
      window.location.href = "/";
    } catch (err) {
      console.error("DEBUGEANDO Error en fetch:", err);
      setError("Error en la conexión con el servidor");
    }
  }
  // inicio de la funcion para manejar el registro
  async function enRegistro(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get("newUsername");
    const password = formData.get("newPassword");

    console.log("DEBUGEANDO Intentando registrar usuario:", username);

    try {
      const res = await fetch("http://localhost:5000/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("DEBUGEANDO Respuesta del registro:", data);

      if (!res.ok) {
        alert(data.message || "Error al registrar usuario");
        return;
      }

      alert("Usuario registrado");
      e.target.reset(); // limpiar formulario
    } catch (err) {
      console.error("DEBUGEANDO Error en fetch registro:", err);
      alert("Error en la conexion con el backend");
    }
  }


  return (
    <div className="content">
      <Header />
      <main className="list">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={enLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario: (admin o user)</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:(admin o user)</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </main>
      <hr className="halloween-hr" style={{ width: "100%" }} />

      <h2>Registrarse</h2>
      <form onSubmit={enRegistro} className="login-form">
        <div className="form-group">
          <label htmlFor="newUsername">Nuevo usuario:</label>
          <input type="text" id="newUsername" name="newUsername" required />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">Nueva contraseña:</label>
          <input type="password" id="newPassword" name="newPassword" required />
        </div>
        <button type="submit" className="login-button">
          Registrarse
        </button>
      </form>
      <hr className="halloween-hr" style={{ width: "100%" }} />
    </div>
  );
}

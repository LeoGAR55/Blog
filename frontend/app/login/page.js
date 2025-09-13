"use client";
import { useState } from "react"; // https://www.w3schools.com/react/react_usestate.asp
import Header from "../../componentes/header";
import Footer from "../../componentes/footer";
//import dotenv from "dotenv"; deben tener el prefijo PUBLIC_ para que next los lea en el frontend

export default function PaginaLogin() {

  //dotenv.config(); // cargar las avriables en el.env

  //const PORT_EXPRESS = process.env.PORT_EXPRESS ||  "algo"; 

  const [error, setError] = useState(""); // almacenar los errores localmente

  // inicia funcion para manejar el login
  async function enLogin(e) {
    e.preventDefault(); // para que no se recargue la pagina cuando se logea alguien

    // jalar los datos de los inputs
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    console.log("[DEBUG] Intentando login con:", { username, password });

    try {
      // fetch al backend para validar si el usuario y su pswd son correctos
      const res = await fetch("http://localhost:$5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // convertir a json
      });

      console.log("[DEBUG] Respuesta del servidor (status):", res.status);
      // asegurar que la respuesta del backend que viene en data venga en json
      const data = await res.json();
      console.log("[DEBUG] Datos recibidos del servidor:", data);  

      if (!res.ok) { // si es diferente de ok (200)
        setError(data.message || "Error en el login");
        return;
      }

      localStorage.setItem("token", data.token); // si el login es ok guiardar el token en localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ username: data.username, role: data.role })
      );

      console.log("[DEBUG] Login exitoso, usuario guardado en localStorage");
      // y ya hasta el final redirigimos a la pagina principal
      // CAMBIAR ESTO PARA QUE VAYA A LA PAGINA DE ADMIN SI ES ADMIN (aun no hay pagina de admin)
      window.location.href = "/";
    } catch (err) {
      console.error("[DEBUG] Error en fetch:", err);
      setError("Error en la conexión con el servidor");
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
          <button type="submit" className="login-button">Entrar</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </main>
      <hr className="halloween-hr" style={{ width: "100%" }} />
      <Footer />
    </div>
  );
}

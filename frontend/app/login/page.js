"use client";
import { useState } from "react";
import Header from "../../componentes/header";
import Footer from "../../componentes/footer";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    console.log("[DEBUG] Intentando login con:", { username, password });

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("[DEBUG] Respuesta del servidor (status):", res.status);

      const data = await res.json();
      console.log("[DEBUG] Datos recibidos del servidor:", data);

      if (!res.ok) {
        setError(data.message || "Error en el login");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ username: data.username, role: data.role })
      );

      console.log("[DEBUG] Login exitoso, usuario guardado en localStorage");

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
        <form onSubmit={handleLogin} className="login-form">
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

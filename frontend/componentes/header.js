"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter(); 
  const [user, setUser] = useState(null); // estado para guardar el usuario loggeado
  const [loading, setLoading] = useState(true); // estado para saber si estamos cargando la sesión

  useEffect(() => {
    // buscamos en localstorage para ver si haya lgun usuario loggeado
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false); // ya cargamos el estado inicial

    // escuchamos cambios en localStorage en otras pestañas
    function handleStorageChange(e) {
      if (e.key === "user") setUser(e.newValue ? JSON.parse(e.newValue) : null);
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  function handleLogout() {
    // eliminamos token y usuario del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); // actualizamos estado

    // redirige a inicio sin recargar toda la app
    router.push("/");
  }

  return (
    <header>
      <div className="main">
        <h1 style={{ borderBottom: "3px solid var(--maincolor)", fontSize: "1.5rem" }}>
          Blog personal
        </h1>
      </div>
      <nav>
        <a href="/">Inicio |</a>
        <a href="/acerca">Acerca de mí |</a>
        <a href="/blogs">Blogs |</a>
        <a href="/base">Base de datos |</a>

        {!loading ? (
          user ? (
            <>
              <span style={{ marginLeft: "10px" }}>
                Bienvenido, <b>{user.username}</b> ({user.role})
              </span>
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: "10px",
                  border: "none",
                  background: "transparent",
                  color: "var(--maincolor)",
                  cursor: "pointer",
                }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <a href="/login">Log in</a>
              <span style={{ marginLeft: "10px", color: "#666" }}>(no estás loggeado)</span>
            </>
          )
        ) : (
          // mensaje mientras cargamos el estado de sesion, antes de esto el header se ponia loco y movia todo el html para recargar el espacio
          <span style={{ marginLeft: "10px", color: "#666" }}>Cargando estado de sesión...</span>
        )}
      </nav>
    </header>
  );
}

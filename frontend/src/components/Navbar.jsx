"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Sistema de Usuarios
      </Link>

      {isAuthenticated ? (
        <div className="navbar-links">
          <Link to="/">Dashboard</Link>
          <Link to="/users">Usuarios</Link>
          <button onClick={handleLogout} className="btn btn-secondary">
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/login">Iniciar Sesión</Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar

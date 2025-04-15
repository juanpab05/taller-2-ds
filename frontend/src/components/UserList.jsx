"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { userService } from "../services/api"

const UserList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll()
      setUsers(response.data)
      setError("")
    } catch (err) {
      setError("Error al cargar los usuarios")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro que desea eliminar este usuario?")) {
      return
    }

    try {
      await userService.delete(id)
      setSuccessMessage("Usuario eliminado con éxito")
      // Refresh the user list
      fetchUsers()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (err) {
      setError("Error al eliminar el usuario")
      console.error(err)
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div>
      <div
        className="header-actions"
        style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}
      >
        <h2>Lista de Usuarios</h2>
        <Link to="/users/new" className="btn btn-primary">
          Nuevo Usuario
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>DNI</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td>{user.dni}</td>
                  <td>{user.phone_number}</td>
                  <td className="action-buttons">
                    <Link to={`/users/edit/${user.id}`} className="btn btn-secondary">
                      Editar
                    </Link>
                    <button onClick={() => handleDelete(user.id)} className="btn btn-danger">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserList

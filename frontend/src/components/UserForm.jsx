"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { userService } from "../services/api"

const UserForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    dni: "",
    phone_number: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fetchLoading, setFetchLoading] = useState(isEditMode)

  useEffect(() => {
    const fetchUser = async () => {
      if (!isEditMode) return

      try {
        const response = await userService.getById(id)
        const userData = response.data

        // Remove password as it's not returned from the API
        const { password, ...userDataWithoutPassword } = userData

        setFormData({
          ...userDataWithoutPassword,
          password: "", // Clear password field for security
        })
      } catch (err) {
        setError("Error al cargar los datos del usuario")
        console.error(err)
      } finally {
        setFetchLoading(false)
      }
    }

    if (isEditMode) {
      fetchUser()
    }
  }, [id, isEditMode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    // Basic validation
    if (!formData.username) return "El nombre de usuario es obligatorio"
    if (!formData.email) return "El email es obligatorio"
    if (!isEditMode && !formData.password) return "La contraseña es obligatoria para nuevos usuarios"

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError("")

    try {
      // Create a copy of the form data
      const dataToSubmit = { ...formData }

      // If editing and password is empty, remove it from the request
      if (isEditMode && !dataToSubmit.password) {
        delete dataToSubmit.password
      }

      if (isEditMode) {
        await userService.update(id, dataToSubmit)
      } else {
        await userService.create(dataToSubmit)
      }

      // Redirect to user list on success
      navigate("/users")
    } catch (err) {
      let errorMessage = "Error al guardar el usuario"

      // Try to get more specific error message from the API
      if (err.response && err.response.data) {
        const apiErrors = err.response.data
        if (typeof apiErrors === "object") {
          const firstError = Object.values(apiErrors)[0]
          if (Array.isArray(firstError) && firstError.length > 0) {
            errorMessage = firstError[0]
          } else if (typeof firstError === "string") {
            errorMessage = firstError
          }
        }
      }

      setError(errorMessage)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="form-container">
      <h2 className="form-title">{isEditMode ? "Editar Usuario" : "Nuevo Usuario"}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="first_name">Nombre</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            className="form-control"
            value={formData.first_name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Apellido</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            className="form-control"
            value={formData.last_name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dni">DNI</label>
          <input
            type="number"
            id="dni"
            name="dni"
            className="form-control"
            value={formData.dni}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone_number">Teléfono</label>
          <input
            type="number"
            id="phone_number"
            name="phone_number"
            className="form-control"
            value={formData.phone_number}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            {isEditMode ? "Contraseña (dejar en blanco para mantener la actual)" : "Contraseña"}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <Link to="/users" className="btn btn-secondary">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserForm

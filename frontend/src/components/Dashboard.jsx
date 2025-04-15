"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { userService } from "../services/api"

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await userService.getAll()
        setUserCount(response.data.length)
      } catch (err) {
        setError("Error al cargar los datos")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserCount()
  }, [])

  if (loading) {
    return <div>Cargando...</div>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h3>Usuarios</h3>
          <p>Total de usuarios: {userCount}</p>
          <Link to="/users" className="btn btn-primary">
            Ver Usuarios
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

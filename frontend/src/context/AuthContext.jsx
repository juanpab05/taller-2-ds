"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { api } from "../services/api"

const AuthContext = createContext()
var payload;

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken) {
      setUser({ token: accessToken })
    }
    setLoading(false)
  }, [])


  const login = async (username, password) => {
    try {
      const response = await api.post("/api/token/", { username, password })
      const {access, refresh } = response.data
      //Se extrae el payload del token de acceso, osea la parte que esta entre el primer y segundo punto
      //const payload = JSON.parse(atob(access.split(".")[1]))
      payload = JSON.parse(atob(access.split(".")[1]))
      //Se extrae el dni, esto se puede porque en serializer se creo el token usando dni como parametro
      //console.log(payload.id)

      localStorage.setItem("accessToken", access)
      localStorage.setItem("refreshToken", refresh)

      setUser({ token: access })
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }



  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken")
      if (refreshToken) {
        await api.post(
          "/api/logout/",
          { refresh: refreshToken },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        )
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const getPayload = {
  id: () => payload.id,
}





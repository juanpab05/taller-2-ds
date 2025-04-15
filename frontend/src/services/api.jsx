import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = "/login"
          return Promise.reject(error)
        }

        // Implement token refresh logic here if your API supports it
        // For now, we'll just redirect to login
        window.location.href = "/login"
        return Promise.reject(error)
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export const userService = {
  getAll: () => api.get("/api/users/"),
  getById: (id) => api.get(`/api/users/${id}/`),
  create: (data) => api.post("/api/users/", data),
  update: (id, data) => api.put(`/api/users/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/api/users/${id}/`, data),
  delete: (id) => api.delete(`/api/users/${id}/`),
}

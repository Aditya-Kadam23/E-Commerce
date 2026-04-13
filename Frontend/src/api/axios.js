import axios from "axios";

// BUG FIX for deployment: was hardcoded to localhost:5000
// Now reads from VITE_API_URL env var so it works in both local and production
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
})

// Automatically attach JWT token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }
    return req;
})

// If token is expired or invalid, clear it and redirect to login
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            window.location.href = "/login"
        }
        return Promise.reject(error);
    }
);

export default API;
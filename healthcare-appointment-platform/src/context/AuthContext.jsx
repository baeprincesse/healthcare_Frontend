import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api, { clearAuthSession } from "../services/api.js";

const AuthContext = createContext(null);

function getTokenExpiry(token) {
  try {
    const encodedPayload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=")));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function getStoredUser() {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("mc_user");
  const expiresAt = token ? getTokenExpiry(token) : null;
  if (!token || !storedUser || (expiresAt && expiresAt <= Date.now())) {
    clearAuthSession();
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    clearAuthSession();
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    const handleAuthLogout = () => {
      setUser(null);
      localStorage.removeItem("mc_user");
      localStorage.removeItem("token");
    };

    window.addEventListener("auth:logout", handleAuthLogout);

    return () => {
      window.removeEventListener("auth:logout", handleAuthLogout);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiresAt = token ? getTokenExpiry(token) : null;
    if (!expiresAt) return undefined;

    const timeout = window.setTimeout(() => {
      clearAuthSession();
      setUser(null);
    }, Math.max(0, expiresAt - Date.now()));

    return () => window.clearTimeout(timeout);
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("mc_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("mc_user");
    }
  }, [user]);

  const register = async (formData) => {
    try {
      const response = await api.post("/users/register", formData);

      return response.data;
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      throw new Error(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  const login = async ({ email, password }) => {
    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      const data = response.data;

      if (!data.user) {
        throw new Error("Login succeeded but no user was returned.");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Store exactly what the backend returned.
      setUser(data.user);

      console.log("LOGIN DATA:", data);
      console.log("LOGIN USER:", data.user);
      console.log("LOGIN ROLE:", data.user.role);

      return data;
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      throw new Error(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  };

  const logout = () => {
    setUser(null);
    clearAuthSession();
  };

  const value = useMemo(
    () => ({
      user,
      authenticated: Boolean(user) && Boolean(localStorage.getItem("token")),
      login,
      register,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export default AuthContext;

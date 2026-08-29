import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("mc_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Unable to load stored user:", error);
      return null;
    }
  });

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
    localStorage.removeItem("token");
    localStorage.removeItem("mc_user");
  };

  const value = useMemo(
    () => ({
      user,
      authenticated: Boolean(user),
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

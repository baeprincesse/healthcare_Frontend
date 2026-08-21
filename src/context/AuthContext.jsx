// import { createContext, useContext, useMemo, useState, useEffect } from "react";
// import api from "../api/api.js";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     try {
//       const raw = localStorage.getItem("mc_user");
//       return raw ? JSON.parse(raw) : null;
//     } catch (e) {
//       return null;
//     }
//   });

//   useEffect(() => {
//     try {
//       if (user) {
//         localStorage.setItem("mc_user", JSON.stringify(user));
//       } else {
//         localStorage.removeItem("mc_user");
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   }, [user]);

//   // REGISTER
//   const register = async ({
//     name,
//     email,
//     phone,
//     password,
//     confirm,
//   }) => {
//     const response = await fetch(
//       "http://localhost:3000/api/users/register",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name,
//           email,
//           phone,
//           password,
//           confirm,
//         }),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Registration failed");
//     }

//     // Save the returned user
//     setUser(data.user);

//     return data;
//   };

//   // LOGIN
//   // LOGIN
// const login = async ({ email, password }) => {
//   const response = await fetch(
//     "http://localhost:3000/api/users/login",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email,
//         password,
//       }),
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Login failed");
//   }

//   // Save user
//   setUser(data.user);

//   // Save JWT token
//   if (data.token) {
//     localStorage.setItem("token", data.token);
//   }

//   return data;
// };
//   // LOGOUT
//   const logout = () => {
//     setUser(null);
//   };

//   const value = useMemo(
//     () => ({
//       user,
//       authenticated: !!user,
//       login,
//       register,
//       logout,
//     }),
//     [user]
//   );

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }

//   return context;
// }

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

import api from "../services/api.js";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("mc_user");
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("mc_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("mc_user");
      }
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  // =========================
  // REGISTER
  // =========================
  const register = async ({
    name,
    email,
    phone,
    password,
    confirm,
  }) => {
    try {
      const response = await api.post("/users/register", {
        name,
        email,
        phone,
        password,
        confirm,
      });

      const data = response.data;

      if (data.user) {
        setUser(data.user);
      }

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed";

      throw new Error(message);
    }
  };

  // =========================
  // LOGIN
  // =========================
  const login = async ({ email, password }) => {
    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      const data = response.data;

      if (data.user) {
        setUser(data.user);
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed";

      throw new Error(message);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const value = useMemo(
    () => ({
      user,
      authenticated: !!user,
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
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}
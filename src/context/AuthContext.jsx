import { createContext, useContext, useMemo, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("mc_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
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
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // REGISTER
  const register = async ({
    name,
    email,
    phone,
    password,
    confirm,
  }) => {
    const response = await fetch(
      "http://localhost:3000/api/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          confirm,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Save the returned user
    setUser(data.user);

    return data;
  };

  // LOGIN
  const login = async ({ email, password }) => {
    // We will connect this to your login API later
    console.log("Login:", email, password);
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
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
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
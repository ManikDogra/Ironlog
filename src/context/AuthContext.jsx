import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Debug: show keys present before clearing
    try {
      const before = {
        token: localStorage.getItem("token"),
        authToken: localStorage.getItem("authToken"),
        idToken: localStorage.getItem("idToken"),
        sessionToken: sessionStorage.getItem("token"),
        cookies: document.cookie,
      };
  console.log("logout: before clear", before);

      // Aggressive clear: remove all client-side storage to ensure no token survives
      try {
        localStorage.clear();
        sessionStorage.clear();
        // Remove cookie named 'token' if present
        document.cookie = "token=; Max-Age=0; path=/;";
      } catch (e) {
        console.warn("logout: clear() failed", e);
      }

      // Aggressive cleanup: remove any localStorage entry that looks like a JWT
      try {
        const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
        const removed = [];
        Object.keys(localStorage).forEach((k) => {
          const v = localStorage.getItem(k);
          if (typeof v === "string" && jwtRegex.test(v)) {
            localStorage.removeItem(k);
            removed.push(k);
          }
        });
    if (removed.length) console.log("logout: removed JWT-like keys", removed);
      } catch (e) {
        console.warn("logout: aggressive cleanup failed", e);
      }
        // Extra pass: remove any key whose value (possibly JSON) contains a JWT substring
        try {
          const removedContains = [];
          const jwtSub = /eyJ[0-9A-Za-z_-]{10,}/; // common JWT header prefix
          Object.keys(localStorage).forEach((k) => {
            const v = localStorage.getItem(k);
            if (typeof v === "string" && jwtSub.test(v)) {
              localStorage.removeItem(k);
              removedContains.push(k);
            } else {
              // try parse JSON and scan values
              try {
                const obj = JSON.parse(v);
                const flat = JSON.stringify(obj);
                if (jwtSub.test(flat)) {
                  localStorage.removeItem(k);
                  removedContains.push(k);
                }
              } catch (e) {
                // not JSON, ignore
              }
            }
          });
          if (removedContains.length) console.log("logout: removed keys containing JWT", removedContains);
        } catch (e) {
          console.warn("logout: contains-scan failed", e);
        }

      const after = {
        token: localStorage.getItem("token"),
        authToken: localStorage.getItem("authToken"),
        idToken: localStorage.getItem("idToken"),
        sessionToken: sessionStorage.getItem("token"),
        cookies: document.cookie,
        localStorageKeys: Object.keys(localStorage),
      };
      console.log("logout: after clear", after);
    } catch (e) {
      // ignore (e.g., SSR or restricted environments)
      console.warn("logout: could not fully clear storage", e);
    }
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

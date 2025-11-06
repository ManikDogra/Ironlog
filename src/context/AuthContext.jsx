import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Start unauthenticated until we verify any token in storage.
  // Previously we assumed presence of a token meant authenticated which caused
  // protected-route redirects and profile fetches on public pages. Delay
  // establishing authentication until the token is validated below.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Consider profile completed only when backend has explicitly marked it so.
  const profileCompleted = !!profile && profile.profileCompleted === true;

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // If token exists on mount, try to load profile once
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      // ignore unset or invalid-string tokens that can sneak into storage
      if (!token || token === "undefined" || token === "null") {
        // No usable token in storage; remain unauthenticated.
        setIsAuthenticated(false);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Basic client-side JWT expiry check: if token is a JWT and expired,
      // drop it immediately instead of calling the API (avoids unnecessary
      // 401/404 noise when opening public pages).
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
          // Helpful debug: print token subject to correlate with profile userSub
          if (payload && payload.sub) console.debug("AuthContext: token sub=", payload.sub);
          if (payload && payload.exp && payload.exp * 1000 < Date.now()) {
            console.info("AuthContext: stored token expired, clearing");
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setProfile(null);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // failed to decode token locally — fall back to server validation below
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "/api"}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          // token invalid/expired — clear local auth so UI redirects to login
          console.warn("AuthContext: token invalid, clearing auth");
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setProfile(null);
          setLoading(false);
          return;
        }
        if (res.status === 404) {
          // No profile exists yet for this user. That's expected for new users.
          // Provide extra debug info so we can compare the token 'sub' vs server
          // stored profile userSub when diagnosing missing profiles.
          try {
            const bodyText = await res.text();
            console.debug("AuthContext: /profile 404 response body:", bodyText);
          } catch (e) {
            console.debug("AuthContext: could not read 404 body", e);
          }
          setProfile(null);
          // Token was valid but there's no profile for this Cognito user yet.
          // Treat the user as authenticated so protected routes can redirect
          // to profile setup, but only after we've finished loading.
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          const body = await res.json();
          setProfile(body.profile || null);
          setIsAuthenticated(true);
          setLoading(false);
        }
      } catch (e) {
        // network or other unexpected error — don't spam the console
        console.debug("AuthContext: load profile failed", e);
        setLoading(false);
      }
    })();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    // fetch profile after login
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "/api"}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 404) {
          try {
            const bodyText = await res.text();
            console.debug("AuthContext: /profile (post-login) 404 body:", bodyText);
          } catch (e) {
            console.debug("AuthContext: could not read post-login 404 body", e);
          }
          // profile not created yet
          setProfile(null);
          return;
        }
        if (res.ok) {
          const body = await res.json();
          setProfile(body.profile || null);
          // record this login on the server so dashboard streak can be computed
          try {
            await fetch(`${import.meta.env.VITE_API_URL || "/api"}/profile/login`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
          } catch (e) {
            console.debug("AuthContext: record login failed", e);
          }
        } else {
          setProfile(null);
        }
      } catch (e) {
        console.debug("AuthContext: fetch profile failed", e);
      }
    })();
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
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, profile, setProfile, profileCompleted, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

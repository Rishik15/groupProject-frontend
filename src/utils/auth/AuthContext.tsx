import { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "../../services/auth/checkAuth";
import { socket } from "../../services/sockets/socket";

type User = {
  first_name: string;
  last_name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  role: string | null;
  authenticated: boolean;
  loading: boolean;
  setAuth: (data: { user: User; role: string }) => void;
  clearAuth: () => void;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  authenticated: false,
  loading: true,
  setAuth: () => { },
  clearAuth: () => { },
  refreshAuth: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const setAuth = (data: { user: User; role: string }) => {
    setUser(data.user);
    setRole(data.role);
    setAuthenticated(true);
  };

  const clearAuth = () => {
    console.log("Clearing auth + disconnecting socket");

    socket.disconnect();

    setUser(null);
    setRole(null);
    setAuthenticated(false);
  };

  const refreshAuth = async () => {
  try {
    const res = await getAuth();

    if (res.authenticated) {
      setAuth({ user: res.user, role: res.role });
    } else {
      setUser(null);
      setRole(null);
      setAuthenticated(false);
    }
  } catch (err) {
    console.error("Auth check failed:", err);

    setUser(null);
    setRole(null);
    setAuthenticated(false);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (authenticated && user) {
      if (!socket.connected) {
        console.log("Connecting socket...");
        socket.connect();
      }

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
      };
    }
  }, [authenticated, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        authenticated,
        loading,
        setAuth,
        clearAuth,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

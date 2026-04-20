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
  clearAuth: (isLogout?: boolean) => void,
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  authenticated: false,
  loading: true,
  setAuth: () => {},
  clearAuth: () => {},
  refreshAuth: async () => {},
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

  const clearAuth = (isLogout = false) => {
    console.log("Clearing auth");

    if (isLogout && socket.connected) {
      console.log("Disconnecting socket (logout)");
      socket.disconnect();
    }

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
  if (!authenticated || !user) return;

  if (!socket.connected) {
    console.log("Connecting socket...");
    socket.connect();
  }

  const handleConnect = () => {
    console.log("Socket connected:", socket.id);
  };

  const handleDisconnect = () => {
    console.log("Socket disconnected");
  };

  socket.on("connect", handleConnect);
  socket.on("disconnect", handleDisconnect);

  return () => {
    socket.off("connect", handleConnect);
    socket.off("disconnect", handleDisconnect);
  };
}, [authenticated, user]);

  useEffect(() => {
    refreshAuth();
  }, []);

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

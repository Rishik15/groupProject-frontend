import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getAuth } from "../../services/auth/checkAuth";
import { socket } from "../../services/sockets/socket";

type User = {
  first_name: string;
  last_name: string;
  email: string;
};

type AuthStatus = "anonymous" | "checking" | "authenticated";

type AuthContextType = {
  user: User | null;
  roles: string[];
  activeMode: string | null;
  status: AuthStatus;
  hasCheckedAuth: boolean;
  setAuth: (data: { user: User; roles: string[] }) => void;
  clearAuth: (isLogout?: boolean) => void;
  refreshAuth: () => Promise<void>;
  setActiveMode: (mode: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  roles: [],
  activeMode: null,
  status: "anonymous",
  hasCheckedAuth: false,
  setAuth: () => {},
  clearAuth: () => {},
  refreshAuth: async () => {},
  setActiveMode: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [activeModeState, setActiveModeState] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("anonymous");
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const hasConnectedSocket = useRef(false);

  const setAuth = (data: { user: User; roles: string[] }) => {
    setUser(data.user);
    setRoles(data.roles);

    setActiveModeState((prev) => {
      if (prev && data.roles.includes(prev)) return prev;
      if (data.roles.includes("coach")) return "coach";
      return data.roles[0] || null;
    });

    setStatus("authenticated");
  };

  const clearAuth = (isLogout = false) => {
    console.log("Clearing auth");

    if (socket.connected) {
      socket.disconnect();
    }

    hasConnectedSocket.current = false;
    setUser(null);
    setRoles([]);
    setActiveModeState(null);
    setStatus("anonymous");
  };

  const refreshAuth = async () => {
    setStatus("checking");

    try {
      const res = await getAuth();

      if (res.authenticated) {
        setAuth({
          user: res.user,
          roles: res.roles || [],
        });
      } else {
        clearAuth();
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      clearAuth();
    } finally {
      setHasCheckedAuth(true);
    }
  };

  useEffect(() => {
    if (activeModeState) {
      localStorage.setItem("activeMode", activeModeState);
    }
  }, [activeModeState]);

  useEffect(() => {
    const saved = localStorage.getItem("activeMode");
    if (saved) setActiveModeState(saved);
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || !user) return;
    if (hasConnectedSocket.current) return;

    console.log("Connecting socket...");
    socket.connect();
    hasConnectedSocket.current = true;

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      hasConnectedSocket.current = false;
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [status, user]);

  const setActiveMode = (mode: string) => {
    setActiveModeState(mode);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        activeMode: activeModeState,
        status,
        hasCheckedAuth,
        setAuth,
        clearAuth,
        refreshAuth,
        setActiveMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

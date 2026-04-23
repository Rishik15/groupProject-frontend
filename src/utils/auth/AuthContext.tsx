import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getAuth } from "../../services/auth/checkAuth";
import { socket } from "../../services/sockets/socket";

type User = {
  first_name: string;
  last_name: string;
  email: string;
};
type Mode = "client" | "coach" | "admin";
type AuthStatus = "anonymous" | "checking" | "authenticated";
type SocketStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "registering"
  | "ready";

type AuthContextType = {
  user: User | null;
  roles: string[];
  activeMode: Mode | null;
  status: AuthStatus;
  socketStatus: SocketStatus;
  socketReady: boolean;
  hasCheckedAuth: boolean;
  setAuth: (data: { user: User; roles: string[] }) => void;
  clearAuth: () => void;
  refreshAuth: () => Promise<void>;
  setActiveMode: (mode: Mode) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  roles: [],
  activeMode: null,
  status: "anonymous",
  socketStatus: "disconnected",
  socketReady: false,
  hasCheckedAuth: false,
  setAuth: () => {},
  clearAuth: () => {},
  refreshAuth: async () => {},
  setActiveMode: () => {},
});

const MODE_KEY = "activeMode";

const getValidMode = (
  roles: string[],
  preferred?: string | null,
): Mode | null => {
  if (preferred && roles.includes(preferred)) {
    return preferred as Mode;
  }
  if (roles.includes("admin")) return "admin";
  if (roles.includes("coach")) return "coach";
  if (roles.includes("client")) return "client";

  return null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [activeMode, setActiveModeState] = useState<Mode | null>(null);
  const [status, setStatus] = useState<AuthStatus>("anonymous");
  const [socketStatus, setSocketStatus] =
    useState<SocketStatus>("disconnected");
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const connectionIdRef = useRef(0);
  const registeredModeRef = useRef<Mode | null>(null);

  const socketReady = socketStatus === "ready";

  // -------------------------
  // AUTH SET
  // -------------------------
  const setAuth = (data: { user: User; roles: string[] }) => {
    const savedMode = sessionStorage.getItem(MODE_KEY);
    const validMode = getValidMode(data.roles, savedMode);

    setUser(data.user);
    setRoles(data.roles);
    setActiveModeState(validMode);
    setStatus("authenticated");
    setHasCheckedAuth(true);
  };

  // -------------------------
  // CLEAR AUTH
  // -------------------------
  const clearAuth = () => {
    connectionIdRef.current++;

    socket.removeAllListeners();
    if (socket.connected) socket.disconnect();

    registeredModeRef.current = null;
    setSocketStatus("disconnected");

    setUser(null);
    setRoles([]);
    setActiveModeState(null);
    setStatus("anonymous");
    setHasCheckedAuth(true);

    sessionStorage.removeItem(MODE_KEY);
  };

  // -------------------------
  // REFRESH AUTH
  // -------------------------
  const refreshAuth = async () => {
    setStatus("checking");

    try {
      const res = await getAuth();

      if (res?.authenticated && res.user) {
        setAuth({
          user: res.user,
          roles: res.roles || [],
        });
        return;
      }

      clearAuth();
    } catch (err) {
      console.error("Auth failed:", err);
      clearAuth();
    } finally {
      setHasCheckedAuth(true);
      setStatus((prev) => (prev === "checking" ? "anonymous" : prev));
    }
  };

  // -------------------------
  // MODE SWITCH
  // -------------------------
  const setActiveMode = (mode: Mode) => {
    if (!roles.includes(mode)) return;
    if (mode === activeMode) return;

    sessionStorage.setItem(MODE_KEY, mode);
    setActiveModeState(mode);
  };

  // -------------------------
  // SOCKET LIFECYCLE
  // -------------------------
  useEffect(() => {
    // if not ready → kill socket
    if (status !== "authenticated" || !user || !activeMode) {
      connectionIdRef.current++;

      socket.removeAllListeners();
      if (socket.connected) socket.disconnect();

      registeredModeRef.current = null;
      setSocketStatus("disconnected");
      return;
    }

    const connectionId = ++connectionIdRef.current;

    // reset
    registeredModeRef.current = null;
    setSocketStatus("connecting");

    socket.removeAllListeners();
    if (socket.connected) socket.disconnect();

    const handleConnect = () => {
      if (connectionIdRef.current !== connectionId) return;

      setSocketStatus("connected");

      setSocketStatus("registering");
      socket.emit("register_mode", { mode: activeMode });

      registeredModeRef.current = activeMode;
      setSocketStatus("ready");
    };

    const handleDisconnect = () => {
      if (connectionIdRef.current !== connectionId) return;

      registeredModeRef.current = null;
      setSocketStatus("disconnected");
    };

    const handleError = (err: any) => {
      if (connectionIdRef.current !== connectionId) return;

      console.error("Socket error:", err);
      registeredModeRef.current = null;
      setSocketStatus("disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    socket.connect();

    return () => {
      connectionIdRef.current++;

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);

      if (socket.connected) socket.disconnect();

      registeredModeRef.current = null;
      setSocketStatus("disconnected");
    };
  }, [status, user, activeMode]);

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        activeMode,
        status,
        socketStatus,
        socketReady,
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

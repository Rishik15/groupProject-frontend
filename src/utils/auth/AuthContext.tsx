import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getAuth } from "../../services/auth/checkAuth";
import { socket } from "../../services/sockets/socket";

type User = {
  first_name: string;
  last_name: string;
  email: string;
};

type Mode = "client" | "coach" | "admin";
type AuthStatus = "anonymous" | "checking" | "authenticated";
type CoachApplicationStatus = "none" | "pending" | "approved" | "rejected";

type SocketStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "registering"
  | "ready"
  | "error";

type QueuedSocketEvent = {
  event: string;
  payload?: any;
};

type AuthContextType = {
  user: User | null;
  roles: string[];
  activeMode: Mode | null;
  status: AuthStatus;
  socketStatus: SocketStatus;
  socketReady: boolean;
  hasCheckedAuth: boolean;
  coachApplicationStatus: CoachApplicationStatus;
  coachModeActivated: boolean;
  setAuth: (data: {
    user: User;
    roles: string[];
    coachApplicationStatus?: CoachApplicationStatus;
    coachModeActivated?: boolean;
  }) => void;
  clearAuth: () => void;
  refreshAuth: () => Promise<void>;
  setActiveMode: (mode: Mode) => void;
  safeEmit: (event: string, payload?: any) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  roles: [],
  activeMode: null,
  status: "anonymous",
  socketStatus: "disconnected",
  socketReady: false,
  hasCheckedAuth: false,
  coachApplicationStatus: "none",
  coachModeActivated: false,
  setAuth: () => {},
  clearAuth: () => {},
  refreshAuth: async () => {},
  setActiveMode: () => {},
  safeEmit: () => {},
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
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [socketStatus, setSocketStatus] =
    useState<SocketStatus>("disconnected");
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [coachApplicationStatus, setCoachApplicationStatus] =
    useState<CoachApplicationStatus>("none");
  const [coachModeActivated, setCoachModeActivated] = useState(false);

  const refreshInFlightRef = useRef(false);
  const connectionIdRef = useRef(0);
  const queuedEventsRef = useRef<QueuedSocketEvent[]>([]);

  const socketReady = socketStatus === "ready";

  const flushQueuedEvents = useCallback(() => {
    if (!socket.connected) return;

    const events = queuedEventsRef.current;
    queuedEventsRef.current = [];

    events.forEach(({ event, payload }) => {
      socket.emit(event, payload);
    });
  }, []);

  const safeEmit = useCallback(
    (event: string, payload?: any) => {
      if (socket.connected && socketReady) {
        socket.emit(event, payload);
        return;
      }

      queuedEventsRef.current.push({ event, payload });
    },
    [socketReady],
  );

  const disconnectSocket = useCallback(() => {
    connectionIdRef.current++;

    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
    socket.off("mode_registered");
    socket.off("mode_registration_failed");
    socket.off("coach_application_status_changed");

    if (socket.connected) {
      socket.disconnect();
    }

    queuedEventsRef.current = [];
    setSocketStatus("disconnected");
  }, []);

  const setAuth = useCallback(
    (data: {
      user: User;
      roles: string[];
      coachApplicationStatus?: CoachApplicationStatus;
      coachModeActivated?: boolean;
    }) => {
      const savedMode = sessionStorage.getItem(MODE_KEY);
      const validMode = getValidMode(data.roles, savedMode);

      setUser(data.user);
      setRoles(data.roles);
      setCoachApplicationStatus(data.coachApplicationStatus ?? "none");
      setCoachModeActivated(data.coachModeActivated ?? false);
      setActiveModeState(validMode);
      setStatus("authenticated");
      setHasCheckedAuth(true);

      if (validMode) {
        sessionStorage.setItem(MODE_KEY, validMode);
      } else {
        sessionStorage.removeItem(MODE_KEY);
      }
    },
    [],
  );

  const clearAuth = useCallback(() => {
    disconnectSocket();

    setUser(null);
    setRoles([]);
    setActiveModeState(null);
    setStatus("anonymous");
    setHasCheckedAuth(true);
    setCoachApplicationStatus("none");
    setCoachModeActivated(false);

    sessionStorage.removeItem(MODE_KEY);
  }, [disconnectSocket]);

  const refreshAuth = useCallback(async () => {
    if (refreshInFlightRef.current) return;

    refreshInFlightRef.current = true;
    setStatus("checking");

    try {
      const res = await getAuth();

      if (res?.authenticated && res.user) {
        setAuth({
          user: res.user,
          roles: res.roles || [],
          coachApplicationStatus:
            res.coachApplicationStatus ??
            res.coachApplicationStatus ??
            "none",
          coachModeActivated:
            res.coachModeActivated ?? res.coachModeActivated ?? false,
        });
      } else {
        clearAuth();
      }
    } catch (err) {
      console.error("Auth failed:", err);
      clearAuth();
    } finally {
      refreshInFlightRef.current = false;
      setHasCheckedAuth(true);
    }
  }, [setAuth, clearAuth]);

  const setActiveMode = useCallback(
    (mode: Mode) => {
      if (!roles.includes(mode)) return;
      if (mode === activeMode) return;

      sessionStorage.setItem(MODE_KEY, mode);
      setActiveModeState(mode);
    },
    [roles, activeMode],
  );

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    if (status !== "authenticated" || !activeMode) {
      disconnectSocket();
      return;
    }

    const connectionId = ++connectionIdRef.current;

    setSocketStatus("connecting");

    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
    socket.off("mode_registered");
    socket.off("mode_registration_failed");
    socket.off("coach_application_status_changed");

    const handleConnect = () => {
      if (connectionIdRef.current !== connectionId) return;

      setSocketStatus("connected");
      setSocketStatus("registering");

      socket.emit("register_mode", { mode: activeMode });
    };

    const handleModeRegistered = (data: { mode: Mode; identity: string }) => {
      if (connectionIdRef.current !== connectionId) return;
      if (data.mode !== activeMode) return;

      setSocketStatus("ready");
      flushQueuedEvents();
    };

    const handleModeRegistrationFailed = () => {
      if (connectionIdRef.current !== connectionId) return;

      setSocketStatus("error");
    };

    const handleDisconnect = () => {
      if (connectionIdRef.current !== connectionId) return;

      setSocketStatus("disconnected");
    };

    const handleConnectError = () => {
      if (connectionIdRef.current !== connectionId) return;

      setSocketStatus("error");
    };

    const handleCoachApplicationStatusChanged = (data: {
      status?: CoachApplicationStatus;
      roles?: string[];
      coachModeActivated?: boolean;
      coach_mode_activated?: boolean;
    }) => {
      if (connectionIdRef.current !== connectionId) return;

      if (data.status) {
        setCoachApplicationStatus(data.status);
      }

      if (typeof data.coachModeActivated === "boolean") {
        setCoachModeActivated(data.coachModeActivated);
      }

      if (typeof data.coach_mode_activated === "boolean") {
        setCoachModeActivated(data.coach_mode_activated);
      }

      if (Array.isArray(data.roles)) {
        setRoles(data.roles);

        setActiveModeState((currentMode) => {
          if (currentMode && data.roles!.includes(currentMode)) {
            return currentMode;
          }

          const savedMode = sessionStorage.getItem(MODE_KEY);
          const validMode = getValidMode(data.roles!, savedMode);

          if (validMode) {
            sessionStorage.setItem(MODE_KEY, validMode);
          } else {
            sessionStorage.removeItem(MODE_KEY);
          }

          return validMode;
        });
      }
    };

    socket.on("connect", handleConnect);
    socket.on("mode_registered", handleModeRegistered);
    socket.on("mode_registration_failed", handleModeRegistrationFailed);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on(
      "coach_application_status_changed",
      handleCoachApplicationStatusChanged,
    );

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      connectionIdRef.current++;

      socket.off("connect", handleConnect);
      socket.off("mode_registered", handleModeRegistered);
      socket.off("mode_registration_failed", handleModeRegistrationFailed);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off(
        "coach_application_status_changed",
        handleCoachApplicationStatusChanged,
      );

      if (socket.connected) {
        socket.disconnect();
      }

      setSocketStatus("disconnected");
    };
  }, [status, activeMode, disconnectSocket, flushQueuedEvents]);

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
        coachApplicationStatus,
        coachModeActivated,
        setAuth,
        clearAuth,
        refreshAuth,
        setActiveMode,
        safeEmit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

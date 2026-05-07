import { useEffect, useState } from "react";
import { Hourglass } from "ldrs/react";
import "ldrs/react/Hourglass.css";
import { checkBackendHealth } from "../../services/health/checkBackendHealth";

type BackendStatus = "checking" | "ready" | "waking";

type BackendGateProps = {
  children: React.ReactNode;
};

const BackendGate = ({ children }: BackendGateProps) => {
  const [status, setStatus] = useState<BackendStatus>("checking");

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;

    const check = async () => {
      try {
        const isHealthy = await checkBackendHealth();

        if (cancelled) return;

        if (isHealthy) {
          setStatus("ready");
          return;
        }

        setStatus("waking");
        timeoutId = window.setTimeout(check, 5000);
      } catch {
        if (cancelled) return;

        setStatus("waking");
        timeoutId = window.setTimeout(check, 5000);
      }
    };

    check();

    return () => {
      cancelled = true;

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (status === "ready") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-5 text-center">
        <Hourglass size="48" bgOpacity="0.15" speed="1.75" color="#4F46E5" />

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Waiting for backend to start
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The app will open automatically once it is ready.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackendGate;

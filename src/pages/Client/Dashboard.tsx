import { useState } from "react";

import DashboardHeader from "../../components/Client/ClientDashboard/Header";
import MetricPlots from "../../components/Client/ClientDashboard/MetricPlots";
import MetricPlots2 from "../../components/Client/ClientDashboard/MetricPlots2";
import MetricRow from "../../components/Client/ClientDashboard/MetricRow";
import TodayWorkoutSessions from "@/components/Client/ClientDashboard/Sessions/TodayWorkoutSessions";

const ClientDashBoard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshDashboard = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <section className="pb-8">
      <DashboardHeader onActivityLogged={refreshDashboard} />

      <MetricRow refreshKey={refreshKey} />

      <TodayWorkoutSessions
        refreshKey={refreshKey}
        onActivityLogged={refreshDashboard}
      />

      <MetricPlots refreshKey={refreshKey} />
      <MetricPlots2 refreshKey={refreshKey} />
    </section>
  );
};

export default ClientDashBoard;

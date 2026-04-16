import DashboardHeader from "../../components/ClientDashboard/Header";
import MetricPlots from "../../components/ClientDashboard/MetricPlots";
import MetricPlots2 from "../../components/ClientDashboard/MetricPlots2";
import MetricRow from "../../components/ClientDashboard/MetricRow";

const ClientDashBoard = () => {
  return (
    <section>
      <DashboardHeader />
      <MetricRow />
      <MetricPlots />
      <MetricPlots2 />
    </section>
  );
};

export default ClientDashBoard;

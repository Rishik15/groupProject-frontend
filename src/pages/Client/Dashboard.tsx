import DashboardHeader from "../../components/Client/ClientDashboard/Header";
import MetricPlots from "../../components/Client/ClientDashboard/MetricPlots";
import MetricPlots2 from "../../components/Client/ClientDashboard/MetricPlots2";
import MetricRow from "../../components/Client/ClientDashboard/MetricRow";

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

import DashboardHeader from "../../components/Client/ClientDashboard/Header";
import MetricPlots from "../../components/Client/ClientDashboard/MetricPlots";
import MetricPlots2 from "../../components/Client/ClientDashboard/MetricPlots2";
import MetricRow from "../../components/Client/ClientDashboard/MetricRow";
import WellnessCheck from "../../components/Client/WellnessCheck/WellnessCheck";

const ClientDashBoard = () => {
  return (
    <section>
      <DashboardHeader />
      <MetricRow />
      <MetricPlots />
      <MetricPlots2 />
      <WellnessCheck/>
    </section>
  );
};

export default ClientDashBoard;

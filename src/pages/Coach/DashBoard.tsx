import CoachMetricRow from "../../components/Coach/CoachDashboard/CoachMetricsRow";
import CoachHeader from "../../components/Coach/CoachDashboard/Header";
import CoachContractsPanel from "../../components/Coach/CoachDashboard/Contracts";
import CoachMetricPlot from "../../components/Coach/CoachDashboard/MetricPlot";

const CoachDashBoard = () => {
  return (
    <section className="flex flex-col gap-4">
      <CoachHeader />
      <CoachMetricRow />
      <CoachContractsPanel />
      <CoachMetricPlot />
    </section>
  );
};

export default CoachDashBoard;

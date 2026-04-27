import MetricPlots from "./MetricPlots";
import MetricPlots2 from "./MetricPlots2";
import MetricRow from "./MetricRow";

type Tab = "dashboard" | "workouts" | "nutrition";

const Dashboard = ({
  contractId,
  onTabChange,
}: {
  contractId: number;
  onTabChange: (tab: Tab) => void;
}) => {
  return (
    <section>
      <MetricRow contract_id={contractId} />
      <MetricPlots contract_id={contractId} onTabChange={onTabChange} />
      <MetricPlots2 contract_id={contractId}  />
    </section>
  );
};

export default Dashboard;
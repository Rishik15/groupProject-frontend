import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../utils/auth/AuthContext";
import CoachDashBoard from "./DashBoard";
import Settings from "../Settings/Settings"; import Chat from "../Chat/Chat";
import CoachContractsPage from "./CoachContractsPage";
// import CoachContractsPage from "./Contracts";
import CreateWorkoutPlan from "../Client/CreateWorkoutPlan";
import Workouts from "../Workouts/Workouts";

const CoachLayout = () => {
  const { user } = useAuth();

  return (
    <section className="min-h-screen bg-white">
      <Navbar
        parent="/coach"
        name={user ? `${user.first_name} ${user.last_name}` : ""}
        email={user?.email || ""}
        notification={5}
      />

      <div className="pt-14">
        <Routes>
          <Route index element={<CoachDashBoard />} />
          <Route path="settings" element={<Settings role="coach" tab="settings" />} />
          <Route path="profile" element={<Settings role="coach" tab="info" />} />
          <Route path="chat" element={<Chat />} />
          <Route path="contracts" element={<CoachContractsPage />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="createWorkout" element={<CreateWorkoutPlan />} />        
        </Routes>
      </div>
    </section>
  );
};

export default CoachLayout;
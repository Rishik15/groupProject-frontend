import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Nutrition from "./Nutrition";
import BrowseCoaches from "./BrowseCoaches";
import Workouts from "../Workouts/Workouts";
import ClientDashBoard from "./Dashboard";
// import WorkoutFlow from "../../components/Client/RecommendedExercises/WorkoutFlow";
import Chat from "../Chat/Chat";
// import Settings from "../Settings/Settings";
import CreateWorkoutPlan from "./CreateWorkoutPlan";
import { useAuth } from "../../utils/auth/AuthContext";

const ClientLayout = () => {
  const { user } = useAuth();
  return (
    <section className="min-h-screen">
      <Navbar
        parent="/client"
        name={user ? `${user.first_name} ${user.last_name}` : ""}
        email={user?.email || ""}

        notification={5}
      />


      <div className="pt-14">
        <Routes>
          <Route index element={<ClientDashBoard />} />
   
          <Route path="chat" element={<Chat />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="/coaches" element={<BrowseCoaches />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="createWorkout" element={<CreateWorkoutPlan />} />
        </Routes>
      </div>
    </section>
  );
};

export default ClientLayout;
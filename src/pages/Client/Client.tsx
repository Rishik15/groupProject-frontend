import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../utils/auth/AuthContext";
import ClientDashBoard from "./Dashboard";
import WorkoutFlow from "../../components/client/RecommendedExercises/WorkoutFlow";

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
          <Route path="recommended" element={<WorkoutFlow />} />
        </Routes>
      </div>
    </section>
  );
};

export default ClientLayout;
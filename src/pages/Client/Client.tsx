import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Nutrition from "./Nutrition";

import ClientDashBoard from "./Dashboard";
import Settings from "../Settings/Settings";
import CreateWorkoutPlan from "./CreateWorkoutPlan";

const ClientLayout = () => {
  return (
    <section className="min-h-screen">
      <Navbar
        parent="/client"
        name="Rishik"
        email="rishik@email.com"
        notification={5}
      />

      <div className="pt-14">
        <Routes>
          <Route index element={<ClientDashBoard />} />
          <Route path="settings" element={<Settings role="client" tab="settings" />} />
          <Route path="profile" element={<Settings role="client" tab="info" />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="createWorkout" element={<CreateWorkoutPlan />} />
        </Routes>
      </div>
    </section>
  );
};
export default ClientLayout;

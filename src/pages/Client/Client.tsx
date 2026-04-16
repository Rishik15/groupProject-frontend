import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Nutrition from "./Nutrition";

import ClientDashBoard from "./Dashboard";
import Chat from "../Chat/Chat";
import Settings from "./Settings";
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
          <Route path="nutrition" element={<Nutrition />} />
        </Routes>
      </div>
    </section>
  );
};
export default ClientLayout;

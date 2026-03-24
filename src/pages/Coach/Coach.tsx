import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Nutrition from "../Nutrition/Nutrition";

import CoachDashBoard from "./DashBoard";

const CoachLayout = () => {
  return (
    <section className="min-h-screen">
      <Navbar
        parent="/coach"
        name="Rishik"
        email="rishik@email.com"
        notification={5}
      />

      <div className="pt-14">
        <Routes>
          <Route index element={<CoachDashBoard />} />
          <Route path="nutrition" element={<Nutrition />} />
        </Routes>
      </div>
    </section>
  );
};

export default CoachLayout;
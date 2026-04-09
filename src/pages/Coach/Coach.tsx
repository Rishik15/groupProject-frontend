import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../utils/auth/AuthContext";
import CoachDashBoard from "./DashBoard";
import CoachContractsPage from "./CoachContractsPage";

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
          <Route path="contracts" element={<CoachContractsPage />} />
        </Routes>
      </div>
    </section>
  );
};

export default CoachLayout;
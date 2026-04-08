import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../utils/auth/AuthContext";
import CoachDashBoard from "./DashBoard";
import Chat from "../Chat/Chat";

const CoachLayout = () => {
  const { user } = useAuth();

  return (
    <section className="min-h-screen">
      <Navbar
        parent="/coach"
        name={user ? `${user.first_name} ${user.last_name}` : ""}
        email={user?.email || ""}
        notification={5}
      />

      <div className="pt-14">
        <Routes>
          <Route index element={<CoachDashBoard />} />
          <Route path="chat" element={<Chat />} />
        </Routes>
      </div>
    </section>
  );
};

export default CoachLayout;

import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../utils/auth/AuthContext";
import ClientDashBoard from "./Dashboard";
import Settings from "../Settings/Settings";

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
          <Route path="settings" element={<Settings role="client" tab="settings" />} />
          <Route path="profile" element={<Settings role="client" tab="info" />} />
        </Routes>
      </div>
    </section>
  );
};
export default ClientLayout;

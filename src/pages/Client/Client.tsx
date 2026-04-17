import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../utils/auth/AuthContext";
import ClientDashBoard from "./Dashboard";
import Chat from "../Chat/Chat";

const ClientLayout = () => {
  const { user } = useAuth();

  return (
    <section className="min-h-screen">
      <Navbar
        parent="/client"
        name={user ? `${user.first_name} ${user.last_name}` : ""}
        email={user?.email || ""}
        notification={0}
      />

      <div className="pt-14">
        <Routes>
          <Route index element={<ClientDashBoard />} />
          <Route path="chat" element={<Chat />} />
        </Routes>
      </div>
    </section>
  );
};
export default ClientLayout;

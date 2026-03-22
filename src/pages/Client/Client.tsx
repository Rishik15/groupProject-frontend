import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

import ClientDashBoard from "./Dashboard";
import BrowseCoaches from "./BrowseCoaches";

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
          <Route path="/coaches" element={<BrowseCoaches />} />
        </Routes>
      </div>
    </section>
  );
};
export default ClientLayout;

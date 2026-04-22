import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import AdminDashBoard from "./Dashboard";
import Users from "./Users";
import Coaches from "./Coaches";
import ClosedReports from "./ClosedReports";
import Exercises from "./Exercises";

const AdminLayout = () => {
    return (
        <section className="min-h-screen">
            <Navbar
                parent="/admin"
                name="Admin"
                email="admin@email.com"
                notifications={[]} //This needs fixing
                count={0} //Same deal here
                setNotifications={() => { }} //And here

            />

            <div className="pt-14">
                <Routes>
                    <Route index element={<AdminDashBoard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="coaches" element={<Coaches />} />
                    <Route path="reports/closed" element={<ClosedReports />} />
                    <Route path="exercises" element={<Exercises />} />
                </Routes>
            </div>
        </section>
    );
};

export default AdminLayout;
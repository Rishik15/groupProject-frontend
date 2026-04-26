import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Dashboard from "./Dashboard";
import Accounts from "./Accounts";
import CoachGovernance from "./CoachGovernance";
import Predictions from "./Predictions";
import Reports from "./Reports";
import Exercises from "./Exercises";
import Workouts from "./Workouts";

const AdminLayout = () => {
    return (
        <section className="min-h-screen bg-default-50">
            <Navbar
                parent="/admin"
                name="Admin"
                email="admin@email.com"
                notifications={[]}
                count={0}
                setNotifications={() => { }}
            />

            <div className="pt-14">
                <Routes>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="accounts" element={<Accounts />} />
                    <Route path="coach-governance" element={<CoachGovernance />} />
                    <Route path="prediction" element={<Predictions />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="exercises" element={<Exercises />} />
                    <Route path="workouts" element={<Workouts />} />
                </Routes>
            </div>
        </section>
    );
};

export default AdminLayout;

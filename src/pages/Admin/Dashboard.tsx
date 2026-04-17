import {
    DollarSign,
    TriangleAlert,
    UserCheck,
    Users,
} from "lucide-react";
import AdminDashboardHeader from "../../components/Admin/Dashboard/Header";
import ReviewQueueSection from "../../components/Admin/Dashboard/ReviewQueueSection";
import AdminStatsSection, {
    type StatCardData,
} from "../../components/Admin/Dashboard/StatSection";

const placeholderStats: StatCardData[] = [
    {
        id: "total-users",
        title: "Total Users",
        value: "1,243",
        helperText: "+43 this month",
        icon: Users,
        tone: "default",
    },
    {
        id: "active-coaches",
        title: "Active Coaches",
        value: "87",
        helperText: "+5 this month",
        icon: UserCheck,
        tone: "default",
    },
    {
        id: "pending-reviews",
        title: "Pending Reviews",
        value: "12",
        helperText: "applications",
        icon: TriangleAlert,
        tone: "default",
    },
    {
        id: "monthly-revenue",
        title: "Monthly Revenue",
        value: "$45.6k",
        helperText: "+1.3%",
        icon: DollarSign,
        tone: "default",
    },
];

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-default-50">
            <AdminDashboardHeader />
            <div className="px-38">
                <AdminStatsSection stats={placeholderStats} />
                <ReviewQueueSection />
            </div>
        </div>
    );
};

export default AdminDashboard;
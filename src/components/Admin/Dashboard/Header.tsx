import { Button, Card } from "@heroui/react";
import {
  Activity,
  ClipboardList,
  Dumbbell,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";

interface AdminDashboardHeaderProps {
  onNavigateToAccounts: () => void;
  onNavigateToCoachGovernance: () => void;
  onNavigateToReports: () => void;
  onNavigateToExercises: () => void;
  onNavigateToWorkouts: () => void;
  onScrollToOverview: () => void;
  onScrollToEngagement: () => void;
  onScrollToReviews: () => void;
}

const AdminDashboardHeader = ({
  onNavigateToAccounts,
  onNavigateToCoachGovernance,
  onNavigateToReports,
  onNavigateToExercises,
  onNavigateToWorkouts,
  onScrollToOverview,
  onScrollToEngagement,
  onScrollToReviews,
}: AdminDashboardHeaderProps) => {
  return (
    <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-default-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-default-600">
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-default-900">
                Platform Overview
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-default-600">
                Use this page as the admin command center for platform health,
                engagement, and review backlog. The detailed workflows live in the
                other wrapper pages.
              </p>
            </div>
          </div>

          <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-default-500">
              Temporary navigation
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button className={"bg-[#5B5EF4]"} onPress={onNavigateToAccounts}>Accounts</Button>
              <Button className={"bg-[#5B5EF4]"} onPress={onNavigateToCoachGovernance}>Coach Governance</Button>
              <Button className={"bg-[#5B5EF4]"} onPress={onNavigateToReports}>Reports</Button>
              <Button className={"bg-[#5B5EF4]"} onPress={onNavigateToExercises}>Exercises</Button>
              <Button className={"bg-[#5B5EF4]"} onPress={onNavigateToWorkouts}>Workouts</Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button className={"bg-[#5B5EF4]"} onPress={onScrollToOverview}>
            <span className="inline-flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </span>
          </Button>
          <Button className={"bg-[#5B5EF4]"} onPress={onScrollToEngagement}>
            <span className="inline-flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Engagement
            </span>
          </Button>
          <Button className={"bg-[#5B5EF4]"} onPress={onScrollToReviews}>
            <span className="inline-flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Review Summary
            </span>
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[20px] border border-default-200 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-default-700">
              <Users className="h-4 w-4" />
              Accounts
            </div>
            <p className="mt-2 text-sm text-default-500">
              User states, active coaches, and account enforcement.
            </p>
          </div>
          <div className="rounded-[20px] border border-default-200 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-default-700">
              <ShieldCheck className="h-4 w-4" />
              Governance
            </div>
            <p className="mt-2 text-sm text-default-500">
              Coach applications and coach price moderation.
            </p>
          </div>
          <div className="rounded-[20px] border border-default-200 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-default-700">
              <Dumbbell className="h-4 w-4" />
              Catalog Management
            </div>
            <p className="mt-2 text-sm text-default-500">
              Exercises, video moderation, and workout templates.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AdminDashboardHeader;

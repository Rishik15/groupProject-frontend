import {
  House,
  Dumbbell,
  Refrigerator,
  MessageCircle,
  CircleStar,
  Search,
  Users,
  ClipboardList,
  ShieldCheck,
  UserCog,
  Wrench,
} from "lucide-react";

export const getNavItems = (activeMode: string | null, parent: string) => {
  if (activeMode === "coach") {
    return [
      { label: "Home", route: parent, icon: <House className="w-4 h-4" /> },
      {
        label: "Manage Clients",
        route: `${parent}/clients`,
        icon: <Users className="w-4 h-4" />,
      },
      {
        label: "Sessions",
        route: `${parent}/sessions`,
        icon: <Dumbbell className="w-4 h-4" />,
      },
      {
        label: "Messages",
        route: `${parent}/chat`,
        icon: <MessageCircle className="w-4 h-4" />,
      },
    ];
  }
  else if (activeMode === "admin") {
    return [
      { label: "Home", route: `${parent}/dashboard`, icon: <House className="w-4 h-4" /> },
      {
        label: "Accounts",
        route: `${parent}/accounts/`,
        icon: <UserCog className="w-4 h-4" />,
      },
      {
        label: "Coach Governance",
        route: `${parent}/coach-governance/`,
        icon: <ShieldCheck className="w-4 h-4" />,
      },
      {
        label: "Predictions",
        route: `${parent}/prediction/`,
        icon: <CircleStar className="w-4 h-4" />,
      },
      {
        label: "Reports",
        route: `${parent}/reports/`,
        icon: <ClipboardList className="w-4 h-4" />,
      },
      {
        label: "Exercises",
        route: `${parent}/exercises/`,
        icon: <Wrench className="w-4 h-4" />,
      },
      {
        label: "Workouts",
        route: `${parent}/workouts/workout-management`,
        icon: <Dumbbell className="w-4 h-4" />,
      },
    ];
  }


  return [
    { label: "Home", route: parent, icon: <House className="w-4 h-4" /> },
    {
      label: "Workouts",
      route: `${parent}/workouts`,
      icon: <Dumbbell className="w-4 h-4" />,
    },
    {
      label: "Nutrition",
      route: `${parent}/nutrition`,
      icon: <Refrigerator className="w-4 h-4" />,
    },
    {
      label: "Find Coaches",
      route: `${parent}/coaches`,
      icon: <Search className="w-4 h-4" />,
    },
    {
      label: "Predictions",
      route: `${parent}/prediction`,
      icon: <CircleStar className="w-4 h-4" />,
    },
    {
      label: "Messages",
      route: `${parent}/chat`,
      icon: <MessageCircle className="w-4 h-4" />,
    },
  ];
};

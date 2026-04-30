import { Tabs } from "@heroui/react";
import { InfoTab } from "./InfoTab";
import ProgressPhotos from "../ProgressPhotos";
import SettingOptions from "./SettingsOptions";
import MyReports from "./MyReports";
import ProfileUpdatesTab from "./ProfileUpdatesTab";
import {
  MessageCircle,
  UserRound,
  Dumbbell,
  ClipboardCheck,
  Siren,
} from "lucide-react";
import { logout } from "../../../services/auth/logout";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../../../utils/auth/AuthContext";

type Props = {
  role: string;
  form: any;
  setForm: any;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
};

type SettingOptionItem = {
  label: string;
  icon: LucideIcon;
  route?: string;
  action?: "become_coach" | "switch_to_coach" | "report_coach";
};

type TabItem = {
  id: string;
  label: string;
  component: React.ReactNode;
};

const coachOptions: SettingOptionItem[] = [
  { label: "Messages", icon: MessageCircle, route: "/coach/chat" },
];

const SettingTab = ({
  role,
  form,
  setForm,
  edit,
  selectedTab,
  setSelectedTab,
}: Props) => {
  const { coachApplicationStatus, coachModeActivated } = useAuth();

  const coachApplicationOption: SettingOptionItem =
    coachApplicationStatus === "pending"
      ? {
          label: "Coach Application In Review",
          icon: ClipboardCheck,
          action: "become_coach",
        }
      : coachApplicationStatus === "rejected"
        ? {
            label: "Coach Application Rejected",
            icon: ClipboardCheck,
            action: "become_coach",
          }
        : coachApplicationStatus === "approved" && !coachModeActivated
          ? {
              label: "Coach Application Approved",
              icon: ClipboardCheck,
              action: "become_coach",
            }
          : coachModeActivated
            ? {
                label: "Go to Coach Dashboard",
                icon: ClipboardCheck,
                action: "switch_to_coach",
              }
            : {
                label: "Become a Coach",
                icon: Dumbbell,
                action: "become_coach",
              };

  const clientOptions: SettingOptionItem[] = [
    { label: "Messages", icon: MessageCircle, route: "/client/chat" },
    { label: "Browse Coaches", icon: UserRound, route: "/client/coaches" },
    {
      label: "Payments and Subscriptions",
      icon: UserRound,
      route: "/client/billing",
    },
    { label: "Report Your Coach", icon: Siren, action: "report_coach" },
    coachApplicationOption,
  ];

  const tabsConfig: Record<string, TabItem[]> = {
    client: [
      {
        id: "info",
        label: "Info",
        component: (
          <InfoTab role="client" form={form} setForm={setForm} edit={edit} />
        ),
      },
      {
        id: "photos",
        label: "Progress Photos",
        component: <ProgressPhotos />,
      },
      {
        id: "reports",
        label: "Reports",
        component: <MyReports />,
      },
      {
        id: "settings",
        label: "Settings",
        component: <SettingOptions options={clientOptions} onLogout={logout} />,
      },
    ],
    coach: [
      {
        id: "info",
        label: "Info",
        component: (
          <InfoTab role="coach" form={form} setForm={setForm} edit={edit} />
        ),
      },
      {
        id: "profile-updates",
        label: "Profile Updates",
        component: <ProfileUpdatesTab />,
      },
      {
        id: "settings",
        label: "Settings",
        component: <SettingOptions options={coachOptions} onLogout={logout} />,
      },
    ],
    admin: [],
  };

  const tabs = tabsConfig[role] ?? [];

  return (
    <div className="flex w-full">
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(String(key))}
        className="w-full"
      >
        <Tabs.List className="flex w-fit gap-4 bg-transparent p-0">
          {tabs.map((tabItem) => (
            <Tabs.Tab
              key={tabItem.id}
              id={tabItem.id}
              className="whitespace-nowrap px-4"
            >
              {tabItem.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {tabs.map((tabItem) => (
          <Tabs.Panel key={tabItem.id} id={tabItem.id} className="w-full">
            <div className="mt-4 flex w-full justify-center">
              <div className="px-12">{tabItem.component}</div>
            </div>
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
};

export default SettingTab;

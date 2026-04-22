import { Tabs } from "@heroui/react";
import { InfoTab } from "./InfoTab";
import ProgressPhoto from "./ProgressPhoto";
import SettingOptions from "./SettingsOptions";
import {
  MessageCircle,
  UserRound,
  CreditCard,
  Bell,
  HelpCircle,
} from "lucide-react";
import { logout } from "../../services/auth/logout";

type Props = {
  role: string;
  form: any;
  setForm: any;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
};

type TabItem = {
  id: string;
  label: string;
  component: React.ReactNode;
};

const clientOptions = [
  { label: "Messages", icon: MessageCircle, route: "/client/messages" },
  { label: "Browse Coaches", icon: UserRound, route: "/client/coaches" },
  { label: "Payments & Billing", icon: CreditCard, route: "/billing" },
  { label: "Notifications", icon: Bell, route: "/notifications" },
];

const coachOptions = [
  { label: "Messages", icon: MessageCircle, route: "/messages" },
  { label: "Browse Coaches", icon: UserRound, route: "/coaches" },
  { label: "Payments & Billing", icon: CreditCard, route: "/billing" },
  { label: "Notifications", icon: Bell, route: "/notifications" },
];

const SettingTab = ({
  role,
  form,
  setForm,
  edit,
  selectedTab,
  setSelectedTab,
}: Props) => {
  const tabsConfig: Record<string, TabItem[]> = {
    client: [
      {
        id: "info",
        label: "Info",
        component: <InfoTab role="client" form={form} setForm={setForm} edit={edit} />,
      },
      {
        id: "photos",
        label: "Progress Photos",
        component: <ProgressPhoto />,
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
        component: <InfoTab role="coach" form={form} setForm={setForm} edit={edit} />,
      },
      {
        id: "settings",
        label: "Settings",
        component: <SettingOptions options={coachOptions} onLogout={logout} />,
      },
    ],
    admin: [
      {
        id: "users",
        label: "Users",
        component: <div>Admin Users</div>,
      },
    ],
  };

  const tabs = tabsConfig[role];

  return (
    <div className="w-full flex">
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(String(key))}
      >
        <Tabs.List className="flex w-fit p-0 bg-transparent gap-4">
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
          <Tabs.Panel key={tabItem.id} id={tabItem.id}>
            <div className="w-full max-w-3xl mx-auto mt-4 flex justify-center">
              {tabItem.component}
            </div>
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
};

export default SettingTab;
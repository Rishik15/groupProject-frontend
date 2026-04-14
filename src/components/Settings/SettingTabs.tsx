import { Tabs, Button } from "@heroui/react";
import { InfoTab } from "./InfoTab";
import ProgressPhoto from "./ProgressPhoto";
import SettingOptions from "./SettingsOptions";
import {
  MessageCircle,
  UserRound,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
} from "lucide-react";
import { logout } from "../../services/auth/logout";

type Props = {
  role: string;
  form: any;
  setForm: any;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

type TabItem = {
  id: string;
  label: string;
  component: React.ReactNode;
};

const clientOptions = [
  { label: "Messages", icon: MessageCircle, route: "/messages" },
  { label: "Browse Coaches", icon: UserRound, route: "/coaches" },
  { label: "Payments & Billing", icon: CreditCard, route: "/billing" },
  { label: "Notifications", icon: Bell, route: "/notifications" },
  { label: "Help & Support", icon: HelpCircle, route: "/help" },
];

const SettingTab = ({ role, form, setForm, edit }: Props) => {
  const tabsConfig: Record<string, TabItem[]> = {
    client: [
      {
        id: "info",
        label: "Info",
        component: <InfoTab form={form} setForm={setForm} edit={edit} />,
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
        component: <InfoTab form={form} setForm={setForm} edit={edit} />,
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
    <div className="flex flex-col gap-4">
      <div className="w-165 flex items-center">
        <Tabs className="">
          <div className="flex- justify-start">
            <Tabs.List className="w-60 flex p-0 bg-transparent">
              {tabs.map((tab) => (
                <Tabs.Tab
                  key={tab.id}
                  id={tab.id}
                  className="whitespace-nowrap"
                >
                  {tab.label}
                  <Tabs.Indicator />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </div>

          {tabs.map((tab: TabItem) => (
            <Tabs.Panel key={tab.id} id={tab.id}>
              {tab.component}
            </Tabs.Panel>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default SettingTab;

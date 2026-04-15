import { useEffect, useState } from "react";
import SettingHeader from "../../components/Settings/SettingHeader";
import SettingCard from "../../components/Settings/SettingCard";
import SettingTab from "../../components/Settings/SettingTabs";
import { GetUserInfo } from "../../services/Setting/GetUserInfo";
import { GetCoachInfo } from "../../services/Setting/GetCoachInfo";

type User = {
  first_name?: string;
  last_name?: string;
  email?: string;
  dob?: string;
  weight?: string | number;
  height?: string | number;
  goal_weight?: string | number;
  bio?: string;
  role?: string;
};

type SettingsProps = {
  role: string;
  tab: string;
};

const Settings = ({ role, tab }: { role: string; tab: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<User | null>(null);
  const [edit, setEdit] = useState(false);
  const [selectedTab, setSelectedTab] = useState(tab);

  useEffect(() => {
    setSelectedTab(tab);
  }, [tab]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await GetUserInfo();

        let mergedForm = userData.user;

        if (role === "coach") {
          const coachData = await GetCoachInfo();
          mergedForm = {
            ...userData.user,
            ...coachData.coach,
          };
        }

        setUser(userData.user);
        setForm(mergedForm);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [role]);

  return (
    <div className="bg-gray-100 mx-auto min-h-screen">
      <div className="flex flex-col items-center gap-8">
        <SettingHeader
          edit={edit}
          setEdit={setEdit}
          selectedTab={selectedTab}
        />

        <div className="w-full max-w-[700px] flex flex-col gap-6">
          <SettingCard role={role} />
          <SettingTab
            role={role}
            form={form}
            setForm={setForm}
            edit={edit}
            setEdit={setEdit}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
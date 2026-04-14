import { useEffect, useState } from "react";
import SettingHeader from "../../components/Settings/SettingHeader";
import SettingCard from "../../components/Settings/SettingCard";
import SettingTab from "../../components/Settings/SettingTabs";
import { GetUserInfo } from "../../services/Setting/GetUserInfo";

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

const Settings = ({ role }: { role: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<User | null>(null);
  const [edit, setEdit] = useState(false);

  console.log(user);
  useEffect(() => {
    const fetchUser = async () => {
      const data = await GetUserInfo();

      setUser(data.user);
      setForm(data.user);
    };

    fetchUser();
  }, []);

  const handleEditToggle = async () => {
    if (edit) {
      setUser(form);
      setEdit(false);
    } else {
      setEdit(true);
    }
  };

  return (
    <div className="bg-gray-100 mx-auto min-h-screen flex flex-col items-center gap-8">
      <SettingHeader edit={edit} setEdit={setEdit} />
      <SettingCard role={role} />
      <SettingTab
        role={role}
        form={form}
        setForm={setForm}
        edit={edit}
        setEdit={setEdit}
      />
    </div>
  );
};

export default Settings;

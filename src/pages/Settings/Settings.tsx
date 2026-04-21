import { useEffect, useState } from "react";
import SettingHeader from "../../components/Settings/SettingHeader";
import SettingCard from "../../components/Settings/SettingCard";
import SettingTab from "../../components/Settings/SettingTabs";
import { GetUserInfo } from "../../services/Setting/GetUserInfo";
import { GetCoachInfo } from "../../services/Setting/GetCoachInfo";
import { updateProfile } from "../../services/Setting/UpdateUserInfo";
import { Alert, Button, CloseButton } from "@heroui/react";
import type { User } from "../../services/Setting/User";
import type { Coach } from "../../services/Setting/Coach";
import { updateCoachProfile } from "../../services/Setting/UpdateCoachInfo";
import { updateCoachAvailability } from "../../services/Setting/saveTime";

type SettingsForm = User & Coach;

type SettingsProps = {
  role: string;
  tab: string;
};


const Settings = ({ role, tab }: SettingsProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<SettingsForm | null>(null);
  const [edit, setEdit] = useState(false);
  const [selectedTab, setSelectedTab] = useState(tab);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!showAlert) return;

    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showAlert]);

  useEffect(() => {
    setSelectedTab(tab);
  }, [tab]);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await GetUserInfo();

      let mergedForm: SettingsForm = {
        ...userData.user,
      };

      if (role === "coach") {
        const coachData = await GetCoachInfo();
        mergedForm = {
          ...userData.user,
          ...coachData.coach,
        };
      }

      setUser(userData.user);
      setForm(mergedForm);
       console.log(mergedForm)
    };

    fetchData();
  }, [role]);

  const handleSave = async () => {
    if (!edit) {
      setEdit(true);
      setShowAlert(false);
      return;
    }

    if (!form) return;

    try {
      if (role === "client") {
        await updateProfile(
          Number(form.weight),
          Number(form.height),
          Number(form.goal_weight)
        );


      }

      if (role === "coach") {
        await updateCoachProfile({
          price: form.price === "" || form.price == null ? undefined : Number(form.price),
          coach_description: form.coach_description,
        });

        await updateCoachAvailability(form.availability ?? []);
      }

      setUser(form);
      setEdit(false);
      setShowAlert(false);
      setTimeout(() => {
        setShowAlert(true);
      }, 10);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
    <div className="bg-gray-100 mx-auto min-h-screen">
      <div className="flex flex-col items-center gap-8">
        <SettingHeader
          edit={edit}
          onClick={handleSave}
          setEdit={setEdit}
          selectedTab={selectedTab}
        />

        <div
          className={`fixed top-20 right-6 z-50 transition-all duration-300 ${showAlert
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
        >
          <Alert status="success" className="rounded-xl bg-[#e5fcf0]">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Profile updated successfully</Alert.Title>
            </Alert.Content>
            <CloseButton
              onClick={() => setShowAlert(false)}
              className="bg-[#e5fcf0] text-green-300"
            />
          </Alert>
        </div>

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
import { useEffect, useState } from "react";
import SettingHeader from "../../components/Settings/Components/SettingHeader";
import SettingCard from "../../components/Settings/Components/SettingCard";
import SettingTab from "../../components/Settings/Components/SettingTabs";
import CustomModal from "../../components/global/Modal";
import { GetUserInfo } from "../../services/Setting/GetUserInfo";
import { GetCoachInfo } from "../../services/Setting/GetCoachInfo";
import { updateProfile } from "../../services/Setting/UpdateUserInfo";
import { Alert, CloseButton } from "@heroui/react";
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
  const [alertTitle, setAlertTitle] = useState("Profile updated successfully");

  const [originalCoachPrice, setOriginalCoachPrice] = useState<number | null>(
    null,
  );

  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [priceModalTitle, setPriceModalTitle] = useState("");
  const [priceModalBody, setPriceModalBody] = useState("");

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

        setOriginalCoachPrice(
          coachData.coach.price == null ? null : Number(coachData.coach.price),
        );
      }

      setUser(userData.user);
      setForm(mergedForm);
      console.log(mergedForm);
    };

    fetchData();
  }, [role]);

  const showSuccessAlert = (message: string) => {
    setAlertTitle(message);
    setShowAlert(false);

    setTimeout(() => {
      setShowAlert(true);
    }, 10);
  };

  const showPriceModal = (title: string, body: string) => {
    setPriceModalTitle(title);
    setPriceModalBody(body);
    setPriceModalOpen(true);
  };

  const handleSave = async () => {
    if (!edit) {
      setEdit(true);
      setShowAlert(false);
      return;
    }

    if (!form) return;

    try {
      let message = "Profile updated successfully";

      if (role === "client") {
        await updateProfile(
          Number(form.weight),
          Number(form.height),
          Number(form.goal_weight),
        );
      }

      if (role === "coach") {
        const coachPayload: {
          price?: number;
          coach_description?: string | null;
        } = {
          coach_description: form.coach_description,
        };

        const currentFormPrice =
          form.price === "" || form.price == null ? null : Number(form.price);

        const priceChanged =
          currentFormPrice !== null &&
          originalCoachPrice !== null &&
          currentFormPrice !== originalCoachPrice;

        if (priceChanged) {
          coachPayload.price = currentFormPrice;
        }

        const result = await updateCoachProfile(coachPayload);

        await updateCoachAvailability(form.availability ?? []);

        if (result?.message) {
          message = result.message;
        }

        if (result?.price_request_created) {
          showPriceModal(
            "Price update sent for review",
            "Your requested price change has been sent to the admin team. You will be notified once it is approved or rejected.",
          );
        }

        if (!priceChanged) {
          setOriginalCoachPrice(currentFormPrice);
        }
      }

      setUser(form);
      setEdit(false);
      showSuccessAlert(message);
    } catch (err: any) {
      console.error("Save failed", err);

      const errorMessage =
        err?.response?.data?.error || "Something went wrong while saving.";

      if (role === "coach" && errorMessage.includes("pending")) {
        showPriceModal(
          "Price update already pending",
          "You already have a pending price change request. Please wait for the admin to approve or reject it before submitting another one.",
        );
        return;
      }

      showPriceModal("Save failed", errorMessage);
    }
  };

  return (
    <div className="mx-auto pb-12">
      <div className="flex flex-col items-center gap-8">
        <SettingHeader
          edit={edit}
          onClick={handleSave}
          setEdit={setEdit}
          selectedTab={selectedTab}
        />

        <div
          className={`fixed top-20 right-6 z-50 transition-all duration-300 ${
            showAlert
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <Alert status="success" className="rounded-xl bg-[#e5fcf0]">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{alertTitle}</Alert.Title>
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

      <CustomModal
        isOpen={priceModalOpen}
        onClose={() => setPriceModalOpen(false)}
        title={priceModalTitle}
        buttonText="Got it"
      >
        {priceModalBody}
      </CustomModal>
    </div>
  );
};

export default Settings;

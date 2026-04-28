import { Button } from "@heroui/react";
import { ChevronRight, LogOut } from "lucide-react";
import { AccountDeletion } from "./AccountDeletion";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import HelpModal from "../Modals/HelpModal";
import BecomeCoachModal from "../Modals/BecomeCoachModal";
import { useAuth } from "../../../utils/auth/AuthContext";

type OptionItem = {
  label: string;
  icon: LucideIcon;
  route?: string;
  action?: "become_coach" | "switch_to_coach";
};

type Props = {
  options: OptionItem[];
  onLogout: () => void;
};

const SettingOptions = ({ options, onLogout }: Props) => {
  const navigate = useNavigate();
  const { roles, coachModeActivated, setActiveMode } = useAuth();

  const [helpOpen, setHelpOpen] = useState(false);
  const [becomeCoachOpen, setBecomeCoachOpen] = useState(false);

  const handleOptionClick = (option: OptionItem) => {
    if (option.action === "become_coach") {
      setBecomeCoachOpen(true);
      return;
    }

    if (option.action === "switch_to_coach") {
      if (!roles.includes("coach") || !coachModeActivated) return;

      sessionStorage.setItem("showCoachModeIntro", "true");
      setActiveMode("coach");
      navigate("/coach");
      return;
    }

    if (option.route === "help") {
      setHelpOpen(true);
      return;
    }

    if (option.route) {
      navigate(option.route);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-165">
      <div className="overflow-hidden rounded-[28px] border border-[#d9dbe3] bg-white">
        {options.map((option, index) => {
          const Icon = option.icon;

          return (
            <Button
              key={option.label}
              onPress={() => handleOptionClick(option)}
              className={`w-full h-[50px] px-6 flex items-center justify-between bg-transparent hover:bg-[#f9fafb] rounded-none ${
                index !== options.length - 1 ? "border-b border-[#e5e7eb]" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="text-base text-black">{option.label}</span>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Button>
          );
        })}
      </div>

      <div className="flex gap-3 items-center justify-center">
        <Button
          className="rounded-md bg-transparent border border-gray-300"
          onPress={() => {
            onLogout();
            navigate("/");
          }}
        >
          <LogOut className="text-black" />
          <p className="text-black">Sign Out</p>
        </Button>

        <AccountDeletion />
      </div>

      <HelpModal setIsOpen={setHelpOpen} isOpen={helpOpen} />

      <BecomeCoachModal
        isOpen={becomeCoachOpen}
        setIsOpen={setBecomeCoachOpen}
      />
    </div>
  );
};

export default SettingOptions;

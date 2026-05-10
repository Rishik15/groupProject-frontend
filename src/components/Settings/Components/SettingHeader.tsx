import { Button } from "@heroui/react";
import { Save, Pencil } from "lucide-react";

type Props = {
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTab: string;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
};

const SettingHeader = ({
  edit,
  selectedTab,
  onClick,
  disabled = false,
}: Props) => {
  const shouldDisableButton = edit && disabled;

  return (
    <div className="w-full bg-white border-b py-5">
      <div className="max-w-[700px] mx-auto px-6 flex items-center justify-between">
        <p className="text-2xl font-semibold">Profile</p>

        <Button
          className={[
            "bg-white text-black hover:bg-indigo-500 hover:text-white rounded-lg flex items-center gap-1",
            shouldDisableButton ? "opacity-50 cursor-not-allowed" : "",
          ].join(" ")}
          onClick={onClick}
          isDisabled={shouldDisableButton}
          style={{ visibility: selectedTab === "info" ? "visible" : "hidden" }}
        >
          {edit ? (
            <>
              <Save className="w-4 h-4" />
              Save
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" />
              Edit
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SettingHeader;

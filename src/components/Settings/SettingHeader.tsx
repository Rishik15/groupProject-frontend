import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { Save, Pencil } from "lucide-react";

type Props = {
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

const SettingHeader = ({ edit, setEdit }: Props) => {
  return (
    <div className="w-full bg-white border-b py-6">
      <div className="max-w-[700px] mx-auto px-6 flex items-center justify-between">
        <p className="text-2xl font-semibold">Profile</p>

        <Button
          className="bg-white text-black hover:bg-indigo-500 hover:text-white rounded-lg"
          onClick={() => setEdit(prev => !prev)}
        >
          {edit ? (
            <>
              <Save />
              Save
            </>
          ) : (
            <>
              <Pencil className="mr-1" />
              Edit
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SettingHeader;

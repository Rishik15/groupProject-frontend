import { useRef } from "react";
import { Button } from "@heroui/react";
import { Image } from "lucide-react";

const ProgressPhoto = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-165 flex justify-center">
      <Button
        className="w-auto mx-auto rounded-md bg-indigo-500 text-sm font-normal"
        onClick={() => fileInputRef.current?.click()}
      >
        <Image />
        Upload Progress Photo
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ProgressPhoto;
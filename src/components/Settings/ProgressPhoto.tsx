import { Card, Avatar, Tabs, Button } from "@heroui/react";
import { Image } from "lucide-react";

const ProgressPhoto = () => {
  return (
    <div>
      <Button className="w-165 mx-auto rounded-md bg-indigo-500 text-sm font-normal mt-3">
        <Image />
        Upload Progress Photo
      </Button>
    </div>
  );
};

export default ProgressPhoto;

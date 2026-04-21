import { Card, Button } from "@heroui/react";
import type { User } from "../../services/Setting/User";

type Prop = {
  form: User;
  edit: boolean
};
export default function CoachCertificationsSection({ form, edit }: Prop) {




  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Coach Certifications
            </p>
            <p className="text-xs">
              Show your credentials on your profile.
            </p>
          </div>
          {edit ? (<Button className="ml-auto bg-white text-black border border-gray-300 rounded-xl">Edit</Button>):(<></>)}
        </div>
        <Card className="bg-gray-100 rounded-xl">
          <div className="px-1">
            <div>
              <p className="text-[#6c7280] font-extrabold">Total Certifications</p>
              <p className="text-xs"> {form.certifications?.length} certifications added</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
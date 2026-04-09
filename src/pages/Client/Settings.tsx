import { useEffect, useState } from "react";
import { Card, Avatar, Tabs, Button } from "@heroui/react";
import { InfoTab } from "./InfoTab";
import {
  Save,
  Pencil,
  LogOut,
  Trash2,
  MessageCircle,
  UserRound,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import ProgressPhoto from "./ProgressPhoto";
import { logout } from "../../services/auth/logout";
import { AccountDeletion } from "./AccountDeletion";

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

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<User | null>(null);
  const [edit, setEdit] = useState<boolean>(false);

  console.log(user);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("http://localhost:8080/client/getInfo", {
        withCredentials: true,
      });

      setUser(res.data.user);
      setForm(res.data.user);
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
    <div className="bg-gray-100 min-h-screen">
      <div className="w-full bg-white border-b py-6">
        <div className="max-w-[700px] mx-auto px-6 flex items-center justify-between">
          <p className="text-2xl font-semibold">Profile</p>
          <Button
            className="bg-white text-black hover:bg-indigo-500 hover:text-white rounded-lg"
            onClick={handleEditToggle}
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

      <div className="max-w-[700px] mx-auto w-full px-6 py-6 flex flex-col gap-4">
        <Card className="w-full rounded-2xl border shadow-sm bg-white">
          <Card.Header className="p-0">
            <div className="flex items-center gap-3 px-5 py-3">
              <Avatar className="w-14 h-14 shrink-0">
                <Avatar.Image
                  alt="Blue"
                  src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                />
                <Avatar.Fallback>B</Avatar.Fallback>
              </Avatar>

              <div className="flex flex-col justify-center">
                <p className="text-lg font-semibold leading-none">
                  {form?.first_name} {form?.last_name}
                </p>
                <p className="text-sm text-gray-500 leading-tight mt-1">
                  {form?.email}
                </p>
                <p className="text-indigo-500 text-xs mt-1">
                  {form?.role === "client"
                    ? "Client"
                    : form?.role === "admin"
                      ? "Admin"
                      : form?.role === "coach"
                        ? "Coach"
                        : ""}
                </p>
                <p></p>
              </div>
            </div>
          </Card.Header>
        </Card>

        <div className="w-full flex justify-center">
          <Tabs className="w-full">
            <Tabs.ListContainer>
              <Tabs.List
                aria-label="Options"
                className="inline-flex items-center gap-1 rounded-full bg-transparent p-0 w-fit"
              >
                <Tabs.Tab
                  id="overview"
                  className="font-normal rounded-full px-2 py-2 text-sm font-medium text-black whitespace-nowrap"
                >
                  Info
                  <Tabs.Indicator />
                </Tabs.Tab>

                <Tabs.Tab
                  id="analytics"
                  className="font-normal rounded-full px-3 py-2 text-sm font-medium text-black whitespace-nowrap"
                >
                  Progress Photos
                  <Tabs.Indicator />
                </Tabs.Tab>

                <Tabs.Tab
                  id="reports"
                  className="font-normal rounded-full px-2 py-2 text-sm font-medium text-black whitespace-nowrap"
                >
                  Settings
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>

            <Tabs.Panel className="pt-0 pl-0 pr-0 mt-5" id="overview">
              <InfoTab form={form} setForm={setForm} edit={edit} />
            </Tabs.Panel>

            <Tabs.Panel className="pt-4" id="analytics">
              <ProgressPhoto />
            </Tabs.Panel>

            <Tabs.Panel className="pt-0 pl-0 pr-0 mt-5" id="reports">
              <div className="flex flex-col gap-3">
                <div className="overflow-hidden rounded-[28px] border border-[#d9dbe3] bg-white">
                  <Button className="w-full h-[50px] px-6 flex items-center justify-between bg-transparent hover:bg-[#f9fafb] border-b border-[#e5e7eb] rounded-none">
                    <div className="flex items-center gap-4">
                      <MessageCircle className="w-5 h-5 text-gray-500" />
                      <span className="text-base font-normal text-black">
                        Messages
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Button>

                  <Button className="w-full h-[50px] px-6 flex items-center justify-between bg-transparent hover:bg-[#f9fafb] border-b border-[#e5e7eb] rounded-none">
                    <div className="flex items-center gap-4">
                      <UserRound className="w-5 h-5 text-gray-500" />
                      <span className="text-base font-normal text-black">
                        Browse Coaches
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Button>

                  <Button className="w-full h-[50px] px-6 flex items-center justify-between bg-transparent hover:bg-[#f9fafb] border-b border-[#e5e7eb] rounded-none">
                    <div className="flex items-center gap-4">
                      <CreditCard className="w-5 h-5 text-gray-500" />
                      <span className="text-base font-normal text-black">
                        Payments & Billing
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Button>

                  <Button className="w-full h-[50px] px-6 flex items-center justify-between bg-transparent hover:bg-[#f9fafb] border-b border-[#e5e7eb] rounded-none">
                    <div className="flex items-center gap-4">
                      <Bell className="w-5 h-5 text-gray-500" />
                      <span className="text-base font-normal text-black">
                        Notifications
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Button>

                  <Button className="w-full h-[50px] px-6 flex items-center justify-between bg-transparent hover:bg-[#f9fafb] border-b border-[#e5e7eb] rounded-none">
                    <div className="flex items-center gap-4">
                      <Shield className="w-5 h-5 text-gray-500" />
                      <span className="text-base font-normal text-black">
                        Privacy
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Button>

                  <Button className="w-full h-[50px] px-6 flex items-center justify-between bg-transparent hover:bg-[#f9fafb] rounded-none">
                    <div className="flex items-center gap-4">
                      <HelpCircle className="w-5 h-5 text-gray-500" />
                      <span className="text-base font-normal text-black">
                        Help & Support
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Button>
                </div>

                <Button
                  className="w-full rounded-md bg-transparent border border-gray-300"
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                >
                  <LogOut className="text-black" />
                  <p className="text-black">Sign Out</p>
                </Button>

                <AccountDeletion />
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;

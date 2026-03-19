import { useState } from "react";
import { Avatar, Badge } from "@heroui/react";
import type { NavbarInterface } from "../../utils/Interfaces/navbar";
import NavLink from "./Navlink";
import DropdownItem from "./Dropdown";
import { House } from "lucide-react";
import { Dumbbell } from "lucide-react";
import { Refrigerator } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { CircleStar } from "lucide-react";
import { Search } from "lucide-react";
import { Bell } from "lucide-react";

export default function Navbar({
  name,
  email,
  role,
  notification,
}: NavbarInterface) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b">
      <div className="w-full h-14 px-36 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-[15px] text-white font-bold w-7 h-7 flex items-center justify-center bg-[#5B5EF4] rounded-lg p-0">
            βF
          </div>
          <span className="text-[15px] font-semibold">βFit</span>
        </div>

        <div className="flex items-center gap-3 text-sm font-medium">
          <NavLink
            label="Home"
            icon={<House className="w-4 h-4" />}
            route="/client"
            active
          />
          <NavLink
            label="Workouts"
            icon={<Dumbbell className="w-4 h-4" />}
            route="/workouts"
          />
          <NavLink
            label="Nutrition"
            icon={<Refrigerator className="w-4 h-4" />}
            route="/nutrition"
          />
          <NavLink
            label="Find Coaches"
            icon={<Search className="w-4 h-4" />}
            route="/coaches"
          />
          <NavLink
            label="Predictions"
            icon={<CircleStar className="w-4 h-4" />}
            route="/prediction"
          />
          <NavLink
            label="Messages"
            icon={<MessageCircle className="w-4 h-4" />}
            route="/chat"
          />
        </div>

        <div className="flex items-center gap-5">
          <Badge.Anchor className="mb-0.5 hover:bg-gray-300 rounded-3xl p-2">
            <Bell className="w-5.5 h-5.5" />
            {notification && notification > 0 && (
              <Badge color="danger" size="sm">
                {notification}
              </Badge>
            )}
          </Badge.Anchor>

          <div className="relative">
            <button className="mt-0.5" onClick={() => setOpen(!open)}>
              <Avatar className="w-8 h-8">
                <Avatar.Image src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" />
                <Avatar.Fallback>RM</Avatar.Fallback>
              </Avatar>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-52 bg-neutral-800 border border-neutral-700 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-700">
                  <p className="text-sm font-medium">Joseph McFall</p>
                  <p className="text-xs text-gray-400">name@flowbite.com</p>
                </div>

                <div className="p-2 text-sm">
                  <DropdownItem label="Dashboard" />
                  <DropdownItem label="Settings" />
                  <DropdownItem label="Earnings" />
                  <DropdownItem label="Sign out" danger />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

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

import { Link } from "react-router-dom";

export default function Navbar({
  parent,
  name,
  email,
  notification,
}: NavbarInterface) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b">
      <div className="h-14 mx-auto px-38 flex items-center justify-between bg-white">
        <Link to={parent} className="flex items-center gap-2">
          <div className="text-[12px] text-white font-bold w-7 h-7 flex items-center justify-center bg-[#5B5EF4] rounded-lg p-0">
            βF
          </div>
          <span className="text-[15px] font-semibold">βFit</span>
        </Link>

        <div className="flex items-center gap-3 text-sm font-medium">
          <NavLink
            label="Home"
            icon={<House className="w-4 h-4" />}
            route={parent}
          />

          <NavLink
            label="Workouts"
            icon={<Dumbbell className="w-4 h-4" />}
            route={`${parent}/workouts`}
          />

          <NavLink
            label="Nutrition"
            icon={<Refrigerator className="w-4 h-4" />}
            route={`${parent}/nutrition`}
          />

          <NavLink
            label="Find Coaches"
            icon={<Search className="w-4 h-4" />}
            route={`${parent}/coaches`}
          />

          <NavLink
            label="Predictions"
            icon={<CircleStar className="w-4 h-4" />}
            route={`${parent}/prediction`}
          />

          <NavLink
            label="Messages"
            icon={<MessageCircle className="w-4 h-4" />}
            route={`${parent}/chat`}
          />
        </div>

        <div className="flex items-center gap-5">
          <div className="hover:bg-gray-200 rounded-3xl w-10 h-10 p-2">
            <Badge.Anchor className="mt-px">
              <Bell className="w-5.5 h-5.5" />
              {notification && notification > 0 && (
                <Badge color="danger" size="sm" className="-translate-y-0.5">
                  {notification}
                </Badge>
              )}
            </Badge.Anchor>
          </div>

          <div className="relative">
            <button className="mt-0.5" onClick={() => setOpen(!open)}>
              <Avatar className="w-8 h-8">
                <Avatar.Image src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" />
                <Avatar.Fallback className="bg-[#a9aaff] font-semibold text-[#444566]">
                  {name.charAt(0)}
                </Avatar.Fallback>
              </Avatar>
            </button>

            {open && (
              <div className="absolute right-0 mt-2.25 w-48 bg-neutral-50 border border-neutral-400 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-400">
                  <p className="text-sm font-medium text-indigo-500">{name}</p>
                  <p className="text-xs text-gray-500">{email}</p>
                </div>

                <div className="p-2 text-sm flex flex-col items-center">
                  <DropdownItem
                    label="My Profile"
                    route={`${parent}/profile`}
                  />
                  <DropdownItem label="Settings" route={`${parent}/settings`} />
                  <DropdownItem label="Sign out" danger type="logout" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import { useEffect, useState } from "react";
import { Card, Avatar, Tabs, Button } from "@heroui/react";
import { getAuth } from "../../services/auth/checkAuth";
import { InfoTab } from "./InfoTab";
import { Save } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { Image } from 'lucide-react';

const Settings = () => {
    const [user, setUser] = useState<any>(null);
    const [edit, setEdit] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            const auth = await getAuth();
            if (auth.authenticated) {
                setUser(auth.user);
            }
        };

        fetchUser();
    }, []);

    if (!user) return <p>Loading...</p>;

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="w-full bg-white border-b py-6">
                <div className="max-w-[700px] mx-auto px-6 flex items-center justify-between">
                    <p className="text-2xl font-semibold">Profile</p>
                    <Button
                        className="bg-white text-black hover:bg-indigo-500 hover:text-white rounded-lg"
                        onClick={() => setEdit(!edit)}
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
                                    {user.first_name} {user.last_name}
                                </p>
                                <p className="text-sm text-gray-500 leading-tight mt-1">
                                    {user.email}
                                </p>
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
                            <InfoTab />
                        </Tabs.Panel>
                        <Tabs.Panel className="pt-4" id="analytics">
                            <Button className="w-full rounded-md bg-indigo-500 text-sm font-normal">
                                <Image />
                                Upload Progress Photo
                            </Button>
                        </Tabs.Panel>
                        <Tabs.Panel className="pt-4" id="reports">
                            <div className="flex flex-col gap-2">
                                <Button className="w-full rounded-md bg-transparent border border-gray-300">
                                    <LogOut className="text-black" /> <p className="text-black">Sign Out</p>
                                </Button>
                                <Button className="w-full rounded-md bg-transparent border border-red-300">
                                    <Trash2 className="text-red-500" />
                                    <p className="text-red-500">Delete Account</p>
                                </Button>
                            </div>
                        </Tabs.Panel>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default Settings;
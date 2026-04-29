import { Button, Card } from "@heroui/react";
import { ClipboardList, PlaySquare } from "lucide-react";
import { useState } from "react";
import ExerciseManagementTab from "../../components/Admin/Exercises/ExerciseManagementTab";
import VideoModerationTab from "../../components/Admin/Exercises/VideoModerationTab";

type ExercisesTab = "management" | "video-moderation";

const exerciseTabs: Array<{
  key: ExercisesTab;
  label: string;
  icon: typeof ClipboardList;
  description: string;
}> = [
  {
    key: "management",
    label: "Exercise Management",
    icon: ClipboardList,
    description:
      "Create, edit, search, and remove exercises using the admin exercise CRUD endpoints.",
  },
  {
    key: "video-moderation",
    label: "Video Moderation",
    icon: PlaySquare,
    description:
      "Review pending exercise videos and approve, reject, or remove clips from the moderation queue.",
  },
];

const Exercises = () => {
  const [selectedTab, setSelectedTab] = useState<ExercisesTab>("management");

  const currentTab =
    exerciseTabs.find((tab) => tab.key === selectedTab) ?? exerciseTabs[0];

  return (
    <div>
      <div className="justify-between items-center px-38 py-4 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">
            Exercise database and video review
          </h1>
          <p className="mt-2 max-w-3xl text-[13.125px]">
            Manage exercise records and moderate uploaded exercise videos from
            one fixed admin page.
          </p>
        </div>
      </div>
      <div className="min-h-[calc(100vh-56px)] bg-default-50 px-36 py-8">
        <div className="space-y-6">
          <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
                  Exercise tabs
                </p>
                <p className="mt-1 text-sm text-default-600">
                  {currentTab.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {exerciseTabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = currentTab.key === tab.key;

                  return (
                    <Button
                      key={tab.key}
                      onPress={() => setSelectedTab(tab.key)}
                      className={
                        active
                          ? "bg-[#5B5EF4] font-semibold"
                          : "bg-[#5B5EF4] text-default-700"
                      }
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>

          {selectedTab === "management" ? (
            <ExerciseManagementTab />
          ) : (
            <VideoModerationTab />
          )}
        </div>
      </div>
    </div>
  );
};

export default Exercises;

import { Modal, Button, Card, Avatar, TextArea, Checkbox } from "@heroui/react";
import { Label, ListBox, Select } from "@heroui/react";
import { useEffect, useState } from "react";
import {
  getPreviousCoaches,
  reportCoach,
  type ReportCoachItem,
} from "../../../services/Setting/reportCoach";

type Prop = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
};

const DEFAULT_AVATAR =
  "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg";

const getSafeImage = (image?: string | null) => {
  if (!image) return DEFAULT_AVATAR;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/uploads")) {
    return `http://localhost:8080${image}`;
  }

  return DEFAULT_AVATAR;
};

const ReportModal = ({ isOpen, setIsOpen }: Prop) => {
  const [coaches, setCoaches] = useState<ReportCoachItem[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<ReportCoachItem | null>(
    null,
  );
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [terminateRequested, setTerminateRequested] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const getClientCoach = async () => {
      try {
        const data = await getPreviousCoaches();
        setCoaches(data);
      } catch (err) {
        console.error("Failed to load coaches for report", err);
        setCoaches([]);
      }
    };

    if (isOpen) {
      getClientCoach();
    }
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    setSelectedCoach(null);
    setReason("");
    setDetails("");
    setTerminateRequested(false);
    setFailedImages({});
  };

  const handleSelectCoach = (coach: ReportCoachItem) => {
    setSelectedCoach(coach);
    setReason("");
    setDetails("");
    setTerminateRequested(false);
  };

  const handleSubmit = async () => {
    if (!selectedCoach) return;

    await reportCoach({
      coachId: selectedCoach.coach_id,
      reason,
      details,
      terminateRequested:
        selectedCoach.contract_status === "active" && terminateRequested,
    });

    closeModal();
  };

  const getStatusLabel = (status?: string) => {
    if (status === "active") return "Current Coach";
    if (status === "terminated") return "Previous Coach";
    return "";
  };

  const isCurrentCoach = selectedCoach?.contract_status === "active";

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[570px]">
            <Modal.Header>
              <div className="mb-3">
                <Modal.CloseTrigger />
                <Modal.Heading className="text-2xl font-extrabold">
                  Report a Coach
                </Modal.Heading>
                <p className="text-sm text-gray-500">
                  Select a current or previous coach, then tell us what
                  happened.
                </p>
              </div>
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Coach</Label>

                {coaches.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No current or previous coaches found
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {coaches.map((coach) => {
                      const isSelected =
                        selectedCoach?.coach_id === coach.coach_id;
                      const statusLabel = getStatusLabel(coach.contract_status);

                      return (
                        <Card
                          data-testid="coach"
                          key={`${coach.coach_id}-${coach.contract_status}`}
                          onClick={() => handleSelectCoach(coach)}
                          className={`flex cursor-pointer flex-row items-center gap-3 border p-3 transition ${
                            isSelected
                              ? "border-indigo-500 bg-[#eef2ff]"
                              : "border-gray-200 bg-white hover:bg-gray-50"
                          }`}
                        >
                          <Avatar>
                            <Avatar.Image
                              src={
                                failedImages[coach.coach_id]
                                  ? DEFAULT_AVATAR
                                  : getSafeImage(coach.image)
                              }
                              onError={() =>
                                setFailedImages((prev) => ({
                                  ...prev,
                                  [coach.coach_id]: true,
                                }))
                              }
                            />
                            <Avatar.Fallback>
                              {coach.full_name?.charAt(0) || "C"}
                            </Avatar.Fallback>
                          </Avatar>

                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-black">
                              {coach.full_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {coach.email}
                            </p>
                          </div>

                          {statusLabel && (
                            <span
                              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                                coach.contract_status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {statusLabel}
                            </span>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedCoach && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label>Reason</Label>
                    <Select
                      aria-label="Report reason"
                      onChange={(key) => {
                        if (key) setReason(key.toString());
                      }}
                      placeholder="Select a reason"
                      className="w-full"
                    >
                      <Select.Trigger
                        data-testid="select"
                        className="h-[48px] w-full rounded-xl border border-gray-200 bg-white px-4"
                      >
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>

                      <Select.Popover>
                        <ListBox aria-label="Report reasons">
                          <ListBox.Item id="harassment" textValue="Harassment">
                            Harassment
                          </ListBox.Item>
                          <ListBox.Item id="spam_scam" textValue="Spam / Scam">
                            Spam / Scam
                          </ListBox.Item>
                          <ListBox.Item
                            id="inappropriate_content"
                            textValue="Inappropriate Content"
                          >
                            Inappropriate Content
                          </ListBox.Item>
                          <ListBox.Item
                            id="fake_profile"
                            textValue="Fake Profile"
                          >
                            Fake Profile
                          </ListBox.Item>
                          <ListBox.Item id="other" textValue="Other">
                            Other
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Details</Label>
                    <TextArea
                      data-testid="details"
                      aria-label="Report details"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Add more details..."
                      className="
                        w-full
                        rounded-xl
                        border border-gray-200
                        bg-white
                        px-4 py-3
                        focus:outline-none
                        focus:ring-0
                        [&_textarea]:min-h-[110px]
                        [&_textarea]:w-full
                        [&_textarea]:resize-none
                        [&_textarea]:bg-transparent
                        [&_textarea]:text-sm
                        [&_textarea]:outline-none
                      "
                    />

                    {isCurrentCoach && (
                      <Checkbox
                        data-testid="checkbox"
                        isSelected={terminateRequested}
                        onChange={(checked) =>
                          setTerminateRequested(Boolean(checked))
                        }
                        className="rounded-xl border border-gray-200 bg-white p-3"
                      >
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>

                        <Checkbox.Content>
                          <div className="flex flex-col">
                            <Label>Terminate contract?</Label>
                            <span className="text-xs text-gray-500">
                              Request to end your contract with this coach.
                            </span>
                          </div>
                        </Checkbox.Content>
                      </Checkbox>
                    )}
                  </div>
                </>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button
                onPress={closeModal}
                className="rounded-xl border border-gray-300 bg-white text-black"
              >
                Close
              </Button>

              {selectedCoach && (
                <Button
                  data-testid="submit"
                  className="rounded-xl bg-indigo-500 text-white"
                  onPress={handleSubmit}
                  isDisabled={!reason}
                >
                  Submit
                </Button>
              )}
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default ReportModal;
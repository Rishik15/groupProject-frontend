import { Modal, Button, Card, Avatar, TextArea, Checkbox } from "@heroui/react";
import { Label, ListBox, Select } from "@heroui/react";
import axios from "axios";
import { useEffect, useState } from "react";

type Prop = {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
};

type Coach = {
    coach_id: number
    full_name: string;
    email: string;
    image?: string;
};

const ReportModal = ({ isOpen, setIsOpen }: Prop) => {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
    const [reason, setReason] = useState<string>("");
    const [details, setDetails] = useState("");
    const [terminateRequested, setTerminateRequested] = useState(false);

    useEffect(() => {
        const getClientCoach = async () => {
            const res = await axios.get("http://localhost:8080/client/getCoaches", {
                withCredentials: true,
            });

            setCoaches(Array.isArray(res.data) ? res.data : []);
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
    };

    const handleSubmit = async () => {
        if (!selectedCoach) return;

        const res = await axios.post(
            "http://localhost:8080/client/reportCoach",
            {
                coach_id: selectedCoach.coach_id,
                reason: reason,
                description: details,
                terminate_requested: terminateRequested
            },
            {
                withCredentials: true
            }
        );
        closeModal()
    };

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
                                    Select a coach first, then tell us what happened.
                                </p>
                            </div>
                        </Modal.Header>

                        <Modal.Body className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>Coach</Label>

                                {coaches.length === 0 ? (
                                    <p className="text-sm text-gray-500">No coaches found</p>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {coaches.map((coach) => {
                                            const isSelected = selectedCoach?.email === coach.email;

                                            return (
                                                <Card
                                                    key={coach.email}
                                                    data-testid="coach"
                                                    onClick={() => setSelectedCoach(coach)}
                                                    className={`flex cursor-pointer flex-row items-center gap-3 border p-3 transition ${isSelected
                                                        ? "border-indigo-500 bg-[#eef2ff]"
                                                        : "border-gray-200 bg-white hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <Avatar>
                                                        <Avatar.Image
                                                            src={
                                                                coach.image ||
                                                                "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                                                            }
                                                        />
                                                    </Avatar>

                                                    <div>
                                                        <p className="font-bold text-black">{coach.full_name}</p>
                                                        <p className="text-sm text-gray-500">{coach.email}</p>
                                                    </div>
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
                                            data-testid="select"
                                            onChange={(key) => {
                                                if (key) setReason(key.toString());
                                            }}
                                            placeholder="Select a reason"
                                            className="w-full"
                                        >
                                            <Select.Trigger className="h-[48px] w-full rounded-xl border border-gray-200 bg-white px-4">
                                                <Select.Value />
                                                <Select.Indicator />
                                            </Select.Trigger>

                                            <Select.Popover>
                                                <ListBox>
                                                    <ListBox.Item id="harassment">Harassment</ListBox.Item>
                                                    <ListBox.Item id="spam_scam">Spam / Scam</ListBox.Item>
                                                    <ListBox.Item id="inappropriate_content">
                                                        Inappropriate Content
                                                    </ListBox.Item>
                                                    <ListBox.Item id="fake_profile">Fake Profile</ListBox.Item>
                                                    <ListBox.Item id="other">Other</ListBox.Item>
                                                </ListBox>
                                            </Select.Popover>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>Details</Label>
                                        <TextArea
                                            data-testid="details"
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
                                        <Checkbox
                                            data-testid="checkbox"
                                            isSelected={terminateRequested}
                                            onChange={(checked) => setTerminateRequested(checked)}
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
                                    className="rounded-xl bg-indigo-500 text-white"
                                    onPress={handleSubmit}
                                    isDisabled={!reason}
                                    data-testid="submit"
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
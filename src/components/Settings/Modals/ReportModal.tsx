import { Modal, Button, Card, Avatar, TextArea } from "@heroui/react";
import { Label, ListBox, Select } from "@heroui/react";
import axios from "axios";
import { useEffect, useState } from "react";

type Prop = {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
};

type Coach = {
    coach_id: number;
    full_name: string;
    email: string;
};

const ReportModal = ({ isOpen, setIsOpen }: Prop) => {
    const [coach, setCoach] = useState<Coach | null>(null);
    const [reason, setReason] = useState<string>("");
    const [details, setDetails] = useState("");

    /**
     * @client_bp.route("/reportCoach", methods=["POST"])
        def reportCoach():
            user_id = session.get("user_id")
            if not user_id:
                return jsonify({"error": "Unauthorized"}), 401

            data = request.get_json()
            if not data:
                return jsonify({"error": "Missing request body"}), 400

            coach_id = data.get("coach_id")
            formReason = data.get("reason")
            formDescription = data.get("description") 
     */
    const onSubmit = async () => {
        const res = await axios.post("http://localhost:8080/client/reportCoach",
            {
                coach_id: coach?.coach_id,
                reason: reason,
                description: details
            },

            {
                withCredentials: true,

            });
    }

    useEffect(() => {
        const getClientCoach = async () => {
            const res = await axios.get("http://localhost:8080/client/getCoaches", {
                withCredentials: true,
            });

            console.log(res.data)
            const coaches: Coach[] = Array.isArray(res.data) ? res.data : [];
            setCoach(coaches[0] ?? null);
        };


        if (isOpen) {
            getClientCoach();
            console.log(coach?.full_name)
        }
    }, [isOpen]);

    const closeModal = () => {
        setIsOpen(false);
        setCoach(null);
        setReason("");
        setDetails("");
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
                                    Tell us what happened with your coach.
                                </p>
                            </div>
                        </Modal.Header>

                        <Modal.Body className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>Coach</Label>

                                {coach ? (
                                    <Card className="flex flex-row items-center gap-3 border border-gray-200 bg-white p-3">
                                        <Avatar>
                                            <Avatar.Image
                                                alt={coach.full_name}
                                                src={
                                                    "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                                                }
                                            />
                                        </Avatar>

                                        <div>
                                            <p className="font-bold text-black">{coach.full_name}</p>
                                            <p className="text-sm text-gray-500">{coach.email}</p>
                                        </div>
                                    </Card>
                                ) : (
                                    <p className="text-sm text-gray-500">No coach found</p>
                                )}
                            </div>

                            {coach && (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <Label>Reason</Label>

                                        <Select
                                            value={reason || null}
                                            onChange={(value) => setReason(String(value))}
                                            placeholder="Select a reason"
                                            className="w-full"
                                        >
                                            <Select.Trigger className="h-[48px] w-full rounded-xl border border-gray-200 bg-white px-4">
                                                <Select.Value />
                                                <Select.Indicator />
                                            </Select.Trigger>

                                            <Select.Popover>
                                                <ListBox>
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

                                                    <ListBox.Item id="fake_profile" textValue="Fake Profile">
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

                            {coach && (
                                <Button
                                    className="rounded-xl bg-indigo-500 text-white"
                                    onPress={onSubmit}
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
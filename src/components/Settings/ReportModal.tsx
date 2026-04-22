import { Modal, Button, Card, Avatar, TextArea } from "@heroui/react";
import { Label, ListBox, Select } from "@heroui/react";

type Prop = {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
};

const ReportModal = ({ isOpen, setIsOpen }: Prop) => {
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
                                    Pick an option and explain to us what happened.
                                </p>
                            </div>
                        </Modal.Header>

                        <Modal.Body className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>Coach</Label>
                                <Card className="flex flex-row items-center gap-3 border bg-[#eef2ff] border-indigo-500">
                                    <Avatar>
                                        <Avatar.Image
                                            alt="Blue"
                                            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                                        />
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-black">Example Coach</p>
                                        <p className="text-sm text-gray-500">coach@example.com</p>
                                    </div>
                                </Card>
                            </div>

                            <Select className="w-full flex gap-2" placeholder="Select a reason">
                                <Label>Reason</Label>
                                <Select.Trigger className="w-full h-[48px] px-4 border border-gray-200 rounded-xl bg-white">
                                    <Select.Value className="m-auto" />
                                    <Select.Indicator />
                                </Select.Trigger>

                                <Select.Popover>
                                    <ListBox>
                                        <ListBox.Item id="harassment" textValue="Harassment">
                                            Harassment
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>

                                        <ListBox.Item id="spam_scam" textValue="Spam / Scam">
                                            Spam / Scam
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>

                                        <ListBox.Item id="inappropriate_content" textValue="Inappropriate Content">
                                            Inappropriate Content
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>

                                        <ListBox.Item id="fake_profile" textValue="Fake Profile">
                                            Fake Profile
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>

                                        <ListBox.Item id="other" textValue="Other">
                                            Other
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                            <TextArea
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
                        </Modal.Body>


                        <Modal.Footer>
                            <Button onPress={() => setIsOpen(false)} className="rounded-xl bg-white text-black border border-gray-300">Close</Button>
                            <Button className="bg-indigo-500 text-white rounded-xl">Submit</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
};

export default ReportModal;
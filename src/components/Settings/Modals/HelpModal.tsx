import { Modal, Card, Button } from "@heroui/react";
import ReportOption from "../Components/SupportOptionsCard";
import { Siren, MessageCircle, ShieldCheck, HelpCircle } from "lucide-react";
import ReportModal from "../Modals/ReportModal";
import { useState } from "react";

type Prop = {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
};

const HelpModal = ({ isOpen, setIsOpen }: Prop) => {
    const [report, setReportModal ] = useState(false);
    return (
        <Modal>
            <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-[570px]">
                        <Modal.Header>
                            <div>
                                <Modal.CloseTrigger />
                                <Modal.Heading className="text-2xl font-extrabold mb-3">Help & Support</Modal.Heading>
                                <p className="text-sm text-gray-500">Need something? Pick an option below and we'll route you to the right place.</p>
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <ReportOption onPress={()=>{setReportModal(true)}}
                                option_name="Report a Coach"
                                option_description="Flag harassment, scams, inappropriate behavior, or safety concerns."
                                icon={Siren}
                                iconColor="text-red-600"
                                iconBg="bg-red-100"
                            />

                            <ReportOption
                                option_name="Safety & Privacy"
                                option_description="Learn how we protect your data and keep you safe on the platform."
                                icon={ShieldCheck}
                                iconColor="text-emerald-600"
                                iconBg="bg-emerald-100"
                            />

                            <ReportOption
                                option_name="Contact Support"
                                option_description="Get help with your account, payments, or technical issues."
                                icon={MessageCircle}
                                iconColor="text-blue-600"
                                iconBg="bg-blue-100"
                            />

                            <ReportOption
                                option_name="Help Center"
                                option_description="Browse FAQs and learn how to use the platform."
                                icon={HelpCircle}
                                iconColor="text-gray-600"
                                iconBg="bg-gray-100"
                            />

                            <ReportModal setIsOpen={setReportModal} isOpen={report} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onPress={() => setIsOpen(false)} className="rounded-xl bg-white text-black border border-gray-300">Close</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
};

export default HelpModal;
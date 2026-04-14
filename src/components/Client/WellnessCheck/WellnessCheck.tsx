import React, { useEffect, useState } from "react";
import { Modal } from "@heroui/react";
import WellnessButton from "./WellnessButton";
import WellnessForm from "./WellnessForm";
import WellnessComplete from "./WellnessComplete";
import { checkSurveyStatus } from "../../../services/WellnessSurvey/checkSurveyStatus";
import { submitSurvey } from "../../../services/WellnessSurvey/submitSurvey";
const WellnessCheck = () => {
    const [moodScore, setMoodScore] = useState<number>(3);
    const [notes, setNotes] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [surveyDone, setDone] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const surveyStatus = async () => {
            const res = await checkSurveyStatus();
            setDone(res)
        }
        surveyStatus();
    }, []);

    const sendWellness = async (): Promise<void> => {
        const payload = {
            mood_score: moodScore,
            notes,
        };

        try {
            setLoading(true);

            const result = await submitSurvey(payload);
            console.log(result);

            // do whatever after success
            setOpen(false);
            setDone(true);

        } catch (error) {
            console.error("Failed to submit wellness survey:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={open} onOpenChange={setOpen}>
            {surveyDone ? (
                <WellnessComplete />
            ) : (
                <div onClick={() => setOpen(true)}>
                    <WellnessButton />
                </div>
            )}
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-[420px]">
                        <Modal.CloseTrigger />

                        <Modal.Header>
                            <Modal.Heading>Mental Wellness</Modal.Heading>
                        </Modal.Header>

                        <Modal.Body>
                            <WellnessForm
                                moodScore={moodScore}
                                setMoodScore={setMoodScore}
                                notes={notes}
                                setNotes={setNotes}
                                onSubmit={sendWellness}
                                loading={loading}
                            />
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
};

export default WellnessCheck;
import React, { useEffect, useState } from "react";
import { Modal } from "@heroui/react";
import WellnessButton from "./WellnessButton";
import WellnessForm from "./WellnessForm";
import WellnessComplete from "./WellnessComplete";
import { checkSurveyStatus } from "../../../services/WellnessSurvey/checkSurveyStatus";
import { submitSurvey } from "../../../services/WellnessSurvey/submitSurvey";
import { useAuth } from "../../../utils/auth/AuthContext";
import { Heart } from "lucide-react";


const WellnessCheck = () => {
  const { status, hasCheckedAuth } = useAuth();

  const authenticated = status === "authenticated";
  const authLoading = !hasCheckedAuth || status === "checking";

  const [moodScore, setMoodScore] = useState<number>(3);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [surveyDone, setDone] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!authenticated) return;

    const surveyStatus = async () => {
      try {
        const res = await checkSurveyStatus();
        setDone(res);
      } catch (error) {
        console.error("Failed to fetch survey status:", error);
        setDone(false);
      }
    };

    surveyStatus();
  }, [authenticated, authLoading]);

  const sendWellness = async (): Promise<void> => {
    const payload = {
      mood_score: moodScore,
      notes,
    };

    try {
      setLoading(true);
      const result = await submitSurvey(payload);
      console.log(result);
      setOpen(false);
      setDone(true);
    } catch (error) {
      console.error("Failed to submit wellness survey:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) return null;

  return (
    <Modal isOpen={open} onOpenChange={setOpen} >
      {surveyDone ? (
        <WellnessComplete />
      ) : (
        <div onClick={() => setOpen(true)}>
          <WellnessButton />
        </div>
      )}

      <Modal.Backdrop className="backdrop-blur-xs">
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-155">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex">
                <Modal.Heading className="text-2xl pb-4">
                  Daily Survey
                </Modal.Heading>
              </div>
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

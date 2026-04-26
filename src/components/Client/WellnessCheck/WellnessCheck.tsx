import { useEffect, useState } from "react";
import { Modal } from "@heroui/react";
import { Coins } from "lucide-react";
import WellnessButton from "./WellnessButton";
import WellnessForm from "./WellnessForm";
import WellnessComplete from "./WellnessComplete";
import { checkSurveyStatus } from "../../../services/WellnessSurvey/checkSurveyStatus";
import { submitSurvey } from "../../../services/WellnessSurvey/submitSurvey";
import { rewardDailySurvey } from "../../../services/WellnessSurvey/predictionSurveyBridge";
import { useAuth } from "../../../utils/auth/AuthContext";
import CustomModal from "../../global/Modal";

const WellnessCheck = () => {
  const { status, hasCheckedAuth } = useAuth();

  const authenticated = status === "authenticated";
  const authLoading = !hasCheckedAuth || status === "checking";

  const [moodScore, setMoodScore] = useState<number>(3);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [surveyDone, setDone] = useState(false);
  const [open, setOpen] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);

  useEffect(() => {
    if (!hasCheckedAuth) return;
    if (status !== "authenticated") return;

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
  }, [status, hasCheckedAuth]);

  const sendWellness = async (): Promise<void> => {
    const payload = {
      mood_score: moodScore,
      notes,
    };

    try {
      setLoading(true);
      const result = await submitSurvey(payload);
      console.log(result);

      const reward = await rewardDailySurvey();
      console.log(reward);

      setOpen(false);
      setDone(true);
      setRewardOpen(true);
    } catch (error) {
      console.error("Failed to submit wellness survey:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status !== "authenticated") return null;

  return (
    <>
      <Modal isOpen={open} onOpenChange={setOpen}>
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

      <CustomModal
        isOpen={rewardOpen}
        onClose={() => setRewardOpen(false)}
      >
        <div className="flex items-start gap-4 pt-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Coins size={24} strokeWidth={2.2} />
          </span>

          <p className="text-left leading-relaxed">
            You have earned{" "}
            <span className="font-semibold text-foreground">100 Points</span>{" "}
            available for use in the{" "}
            <span className="font-semibold text-foreground">Prediction</span> tab.
          </p>
        </div>
      </CustomModal>
    </>
  );
};

export default WellnessCheck;
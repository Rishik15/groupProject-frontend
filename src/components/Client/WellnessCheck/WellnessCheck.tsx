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

  const [moodScore, setMoodScore] = useState<number>(5);
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

      await submitSurvey(payload);
      await rewardDailySurvey();

      setOpen(false);
      setDone(true);
      setRewardOpen(true);
      setNotes("");
      setMoodScore(5);
    } catch (error) {
      console.error("Failed to submit wellness survey:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status !== "authenticated") return null;

  return (
    <>
      {surveyDone ? (
        <WellnessComplete />
      ) : (
        <WellnessButton onPress={() => setOpen(true)} />
      )}

      <Modal isOpen={open} onOpenChange={setOpen}>
        <Modal.Backdrop className="bg-black/35 backdrop-blur-sm">
          <Modal.Container>
            <Modal.Dialog className="w-[94vw] rounded-[26px] border border-white/60 bg-white p-0 shadow-2xl sm:max-w-[720px]">
              <Modal.CloseTrigger className="right-5 top-5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200" />

              <Modal.Header className="border-b border-gray-100 px-7 pb-4 pt-6">
                <div>
                  <Modal.Heading className="text-2xl font-bold tracking-tight text-[#202020]">
                    Daily Survey
                  </Modal.Heading>

                  <p className="mt-1 text-sm text-gray-500">
                    Quick check in for your mood, sleep, and notes.
                  </p>
                </div>
              </Modal.Header>

              <Modal.Body className="px-7 py-5">
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

      <CustomModal isOpen={rewardOpen} onClose={() => setRewardOpen(false)}>
        <div className="flex items-start gap-4 pt-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Coins size={24} strokeWidth={2.2} />
          </span>

          <p className="text-left leading-relaxed">
            You have earned{" "}
            <span className="font-semibold text-foreground">100 Points</span>{" "}
            available for use in the{" "}
            <span className="font-semibold text-foreground">Prediction</span>{" "}
            tab.
          </p>
        </div>
      </CustomModal>
    </>
  );
};

export default WellnessCheck;
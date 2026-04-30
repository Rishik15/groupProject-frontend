import { Button, Modal, Spinner } from "@heroui/react";
import { CheckCircle, Clock, ShieldCheck, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { activateCoachMode } from "../../../services/auth/activateCoach";
import { useState } from "react";
import { useAuth } from "../../../utils/auth/AuthContext";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export default function BecomeCoachModal({ isOpen, setIsOpen }: Props) {
  const navigate = useNavigate();

  const { coachApplicationStatus, coachModeActivated, refreshAuth } = useAuth();

  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const goToOnboarding = () => {
    setIsOpen(false);
    navigate("/onboarding/coach?source=client");
  };

  const goToCoachDashboard = async () => {
    try {
      setLoading(true);

      await activateCoachMode();

      sessionStorage.setItem("activeMode", "coach");
      sessionStorage.setItem("showCoachModeIntro", "true");

      await refreshAuth();

      setIsOpen(false);
      navigate("/coach");
    } catch (err) {
      console.error("Failed to activate coach mode", err);
    } finally {
      setLoading(false);
    }
  };

  const content = {
    none: {
      icon: <ShieldCheck className="h-5 w-5 text-indigo-600" />,
      iconBg: "bg-indigo-100",
      title: "Become a Coach",
      body: "To become a coach, you need to complete the coach onboarding form. After you submit it, an admin will review your application.",
      primaryText: "Start Onboarding",
      primaryAction: goToOnboarding,
      showPrimary: true,
    },
    pending: {
      icon: <Clock className="h-5 w-5 text-yellow-600" />,
      iconBg: "bg-yellow-100",
      title: "Application Under Review",
      body: "Your coach application is still being reviewed. We will notify you once an admin makes a decision.",
      primaryText: "",
      primaryAction: closeModal,
      showPrimary: false,
    },
    approved: {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      iconBg: "bg-green-100",
      title: coachModeActivated ? "Coach Mode Active" : "Application Approved",
      body: coachModeActivated
        ? "Your coach account is already active. You can go to your coach dashboard or switch roles from your avatar."
        : "Your coach application has been approved. You can now go to your coach dashboard and start using coach mode.",
      primaryText: "Go to Coach Dashboard",
      primaryAction: goToCoachDashboard,
      showPrimary: true,
    },
    rejected: {
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      iconBg: "bg-red-100",
      title: "Application Rejected",
      body: "Your coach application was rejected. You can review your information and submit a new application if allowed.",
      primaryText: "Apply Again",
      primaryAction: goToOnboarding,
      showPrimary: true,
    },
  }[coachApplicationStatus];

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen} variant="blur">
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-107.5 rounded-2xl">
            <Modal.CloseTrigger className="top-6 right-5" />

            <Modal.Header>
              <div className="flex flex-col gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${content.iconBg}`}
                >
                  {content.icon}
                </div>
                <div>
                  <Modal.Heading className="text-xl font-bold text-black">
                    {content.title}
                  </Modal.Heading>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {content.body}
                  </p>
                </div>
              </div>
            </Modal.Header>

            <Modal.Footer>
              <div className="flex w-full justify-end gap-2">
                <Button
                  onPress={closeModal}
                  className="rounded-xl border border-gray-300 bg-white text-black"
                >
                  Close
                </Button>

                {content.showPrimary && (
                  <Button
                    onPress={content.primaryAction}
                    isDisabled={loading}
                    className="rounded-xl bg-indigo-500 text-white"
                  >
                    {loading ? (
                      <Spinner size="lg" color="accent" />
                    ) : (
                      content.primaryText
                    )}
                  </Button>
                )}
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

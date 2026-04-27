import { useState } from "react";
import {
  Button,
  Description,
  Input,
  Label,
  TextArea,
  TextField,
} from "@heroui/react";
import type { CoachProfile } from "../../services/contract/requestcontracts";

interface RequestContractModalProps {
  isOpen: boolean;
  coach: CoachProfile;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (values: {
    training_reason: string;
    goals: string;
    preferred_schedule: string;
    notes: string;
  }) => void;
}

export default function RequestContractModal({
  isOpen,
  coach,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: RequestContractModalProps) {
  const [trainingReason, setTrainingReason] = useState("");
  const [goals, setGoals] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({
      training_reason: trainingReason.trim(),
      goals: goals.trim(),
      preferred_schedule: preferredSchedule.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-foreground">
            Request coaching
          </h2>
          <p className="mt-1 text-sm text-default-400">
            Tell {coach.first_name} why you want training and what you need help
            with.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <TextField
            isRequired
            fullWidth
            name="training_reason"
            value={trainingReason}
            onChange={setTrainingReason}
          >
            <Label>Why do you want coaching?</Label>
            <TextArea
              rows={3}
              placeholder="Example: I want help losing weight and staying consistent."
            />
            <Description>
              This helps the coach understand your reason.
            </Description>
          </TextField>

          <TextField
            isRequired
            fullWidth
            name="goals"
            value={goals}
            onChange={setGoals}
          >
            <Label>Main goals</Label>
            <TextArea
              rows={3}
              placeholder="Example: Lose 15 pounds, build strength, improve endurance."
            />
            <Description>Add the main things you want to improve.</Description>
          </TextField>

          <TextField
            fullWidth
            name="preferred_schedule"
            value={preferredSchedule}
            onChange={setPreferredSchedule}
          >
            <Label>Preferred schedule</Label>
            <Input placeholder="Example: Weekdays after 6 PM or weekends" />
          </TextField>

          <TextField fullWidth name="notes" value={notes} onChange={setNotes}>
            <Label>Extra notes</Label>
            <TextArea
              rows={3}
              placeholder="Any injuries, preferences, experience level, or questions."
            />
          </TextField>
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onPress={onClose} isDisabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            className="bg-[#5B5EF4] text-white"
            onPress={handleSubmit}
            isDisabled={isSubmitting || !trainingReason.trim() || !goals.trim()}
          >
            {isSubmitting ? "Sending..." : "Send request"}
          </Button>
        </div>
      </div>
    </div>
  );
}

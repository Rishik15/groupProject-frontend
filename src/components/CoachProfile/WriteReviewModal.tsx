import { Button, Modal } from "@heroui/react";
import { X } from "lucide-react";
import { coachReviewTheme } from "../../utils/CoachReview/coachReviewTheme";
import StarRating from "./StarRating";

interface WriteReviewModalProps {
  isOpen: boolean;
  coachId: number;
  rating: number;
  reviewText: string;
  isSubmitting: boolean;
  submitError: string;
  onClose: () => void;
  onRatingChange: (rating: number) => void;
  onReviewTextChange: (value: string) => void;
  onSubmit: () => void;
}

export default function WriteReviewModal({
  isOpen,
  coachId,
  rating,
  reviewText,
  isSubmitting,
  submitError,
  onClose,
  onRatingChange,
  onReviewTextChange,
  onSubmit,
}: WriteReviewModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      variant="blur"
      isDismissable={!isSubmitting}
      isKeyboardDismissDisabled={isSubmitting}
      className="bg-black/40"
    >
      <Modal.Container placement="center" size="md">
        <Modal.Dialog
          aria-label={`Write review for coach ${coachId}`}
          className="rounded-2xl border p-0 shadow-xl"
          style={{
            borderColor: coachReviewTheme.colors.border,
            backgroundColor: coachReviewTheme.colors.white,
          }}
        >
          <Modal.Header className="relative border-b px-6 py-5">
            <div className="pr-10">
              <Modal.Heading
                className="font-semibold"
                style={{
                  color: coachReviewTheme.colors.heading,
                  fontSize: coachReviewTheme.fontSizes.title,
                }}
              >
                Write Review
              </Modal.Heading>

              <p
                className="mt-1"
                style={{
                  color: coachReviewTheme.colors.secondaryText,
                  fontSize: coachReviewTheme.fontSizes.label,
                }}
              >
                Share your experience with this coach.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                color: coachReviewTheme.colors.secondaryText,
              }}
            >
              <X size={18} />
            </button>
          </Modal.Header>

          <Modal.Body className="px-6 py-3">
            <div className="mb-5">
              <p
                className="mb-2"
                style={{
                  color: coachReviewTheme.colors.heading,
                  fontSize: coachReviewTheme.fontSizes.label,
                }}
              >
                Rating
              </p>

              <StarRating rating={rating} onChange={onRatingChange} size={20} />
            </div>

            <div>
              <label
                htmlFor="coach-review-text"
                className="mb-2 block"
                style={{
                  color: coachReviewTheme.colors.heading,
                  fontSize: coachReviewTheme.fontSizes.label,
                }}
              >
                Review
              </label>

              <textarea
                id="coach-review-text"
                value={reviewText}
                onChange={(event) => onReviewTextChange(event.target.value)}
                rows={5}
                disabled={isSubmitting}
                className="w-full resize-none rounded-xl border p-3 outline-none transition focus:border-[#5B5EF4] disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  borderColor: coachReviewTheme.colors.border,
                  color: coachReviewTheme.colors.heading,
                  fontSize: coachReviewTheme.fontSizes.body,
                }}
                placeholder="Write your review here..."
              />
            </div>

            {submitError ? (
              <p
                className="mt-4"
                style={{
                  color: coachReviewTheme.colors.danger,
                  fontSize: coachReviewTheme.fontSizes.body,
                }}
              >
                {submitError}
              </p>
            ) : null}
          </Modal.Body>

          <Modal.Footer className="flex justify-end gap-3 border-t px-6 py-4">
            <Button
              onPress={onClose}
              variant="secondary"
              isDisabled={isSubmitting}
              style={{
                color: coachReviewTheme.colors.heading,
                fontSize: coachReviewTheme.fontSizes.label,
              }}
            >
              Cancel
            </Button>

            <Button
              onPress={onSubmit}
              isDisabled={isSubmitting}
              style={{
                backgroundColor: coachReviewTheme.colors.primary,
                color: "#FFFFFF",
                fontSize: coachReviewTheme.fontSizes.label,
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

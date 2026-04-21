import { Button, Card } from "@heroui/react";

type Props = {
  openModal: () => void;
  openModalWorkouts: () => void;
};

const RecommendedTitle = ({ openModal, openModalWorkouts }: Props) => {
  return (
    <Card className="flex w-[200%]">
      <div className="m-3">
        <div className="mb-3 inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
          Recommended for your current goal
        </div>

        <div className="w-75">
          <h1 className="text-4xl font-bold">
            Workout plans that actually feel picked for you.
          </h1>
        </div>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Based on your goals and preferences, we matched you with plans that
          actually fit so you can start strong and stay consistent.
        </p>

        <div className="mt-3 flex gap-3">
          <Button
            onPress={openModalWorkouts}
            className="h-12 rounded-2xl bg-indigo-500 text-white"
          >
            Browse plans
          </Button>

          <Button
            onPress={openModal}
            className="h-12 rounded-2xl border border-gray-300 bg-white text-black"
          >
            Retake preferances
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RecommendedTitle;
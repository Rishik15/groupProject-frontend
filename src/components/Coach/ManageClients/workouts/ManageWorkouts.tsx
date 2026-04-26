import WeeklyWorkoutSchedule from "./WeeklyWorkoutSchedule";

const ManageWorkouts = ({ contractId }: { contractId: number }) => {
  return (
    <main className="flex flex-col w-full justify-center px-12">
      <WeeklyWorkoutSchedule contractId={contractId} />
    </main>
  );
};

export default ManageWorkouts;

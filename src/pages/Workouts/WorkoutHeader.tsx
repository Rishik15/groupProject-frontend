const WorkoutHeader = () => {
  return (
    <div className="py-4 px-36 shadow-sm bg-white">
      <div className="flex flex-col h-full justify-between">
        <p className="text-[20px] font-semibold">
          Workout Tracker
        </p>

        <p className="max-w-3xl text-[13px] text-gray-600">
          View your weekly workout schedule, add session blocks to the calendar,
          and open the workout logger for completed strength sets or cardio
          activity.
        </p>
      </div>
    </div>
  );
};

export default WorkoutHeader;

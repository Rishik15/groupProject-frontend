import type { CoachSessionClient } from "../../utils/Interfaces/CoachSession/coachSession";
import WeeklyCoachSessionSchedule from "./WeeklyCoachSessionSchedule";

interface CoachSessionScheduleSectionProps {
  clients: CoachSessionClient[];
}

export default function CoachSessionScheduleSection({
  clients,
}: CoachSessionScheduleSectionProps) {
  return <WeeklyCoachSessionSchedule clients={clients} />;
}

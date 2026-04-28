import { useEffect, useState } from "react";
import CoachCard, {
  SkeletonCard,
} from "../../components/LandingPage/CoachCard.tsx";
import type { Coach } from "../../utils/Interfaces/coachquery";
import { top5 } from "../../services/landing/top5.ts";
import { useNavigate } from "react-router-dom";

export default function TopRatedCoaches() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const data = await top5();
      setCoaches(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <section>
        <div>
          <h2>Top-rated coaches</h2>
          <p>Work with certified professionals</p>
          <button
            onClick={() => (window.location.href = "/coaches")}
            className="text-sm font-medium hover:underline"
          >
            View all →
          </button>
        </div>
        <div>
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div>
        <h2>Top-rated coaches</h2>
        <p>Work with certified professionals</p>
        <button
          onClick={() => (window.location.href = "/coaches")}
          className="text-sm font-medium hover:underline"
        >
          View all →
        </button>
      </div>
      <div>
        {coaches.map((coach) => (
          <CoachCard key={coach.coach_id} coach={coach} />
        ))}
      </div>
    </section>
  );
}

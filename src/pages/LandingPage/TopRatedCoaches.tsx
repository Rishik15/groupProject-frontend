import { useEffect, useState } from "react";
import { Link } from "@heroui/react";
import CoachCard, { SkeletonCard, type Coach } from "./landingpage/CoachCard.tsx";
import { top5 } from "./services/landing/top5.ts";

export default function TopRatedCoaches() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

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
          <Link href="/coaches">View all →</Link>
        </div>
        <div>
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div>
        <h2>Top-rated coaches</h2>
        <p>Work with certified professionals</p>
        <Link href="/coaches">View all →</Link>
      </div>
      <div>
        {coaches.map((coach) => <CoachCard key={coach.id} coach={coach} />)}
      </div>
    </section>
  );
}
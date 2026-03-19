import { Link } from "@nextui-org/react";
import CoachCard, { SkeletonCard, type Coach } from "./CoachCard";

import { useEffect, useState } from "react";
import axios from 'axios';


const BASE_URL = "http://localhost:8080";

async function fetchTopCoaches(): Promise<Coach[]> {
  const res = await axios.get(`${BASE_URL}/landing/topCoaches`);
  return res.data;
}


export default function TopRatedCoaches() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchTopCoaches()
      .then(setCoaches)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-16 py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Top-rated coaches</h2>
          <p className="text-sm text-default-400 mt-1">Work with certified professionals</p>
        </div>
        <Link href={`${BASE_URL}/coaches`} size="sm" className="font-medium text-foreground self-center">
          View all →
        </Link>
      </div>      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : coaches.map((coach) => <CoachCard key={coach.id} coach={coach} />)
        }
      </div>
    </section>
  );
}
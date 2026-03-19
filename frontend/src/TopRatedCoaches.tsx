import { useEffect, useState } from "react";
import { Card, Skeleton, Link } from "@heroui/react";
import axios from 'axios';

export interface Coach {
  id: number;
  first_name: string;
  last_name: string;
  coach_description: string;
  avg_rating: number;
  review_count: number;
}

const BASE_URL = "http://localhost:8080";

async function fetchTopCoaches(): Promise<Coach[]> {
  const res = await axios.get(`${BASE_URL}/landing/topCoaches`);
  return res.data;
}


function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="#F5A623">
        <path d="M8 1l1.854 3.756L14 5.528l-3 2.924.708 4.132L8 10.5l-3.708 2.084L5 8.452 2 5.528l4.146-.772z" />
      </svg>
      <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
      <span className="text-sm text-default-400">({reviewCount})</span>
    </div>
  );
}


function CoachCard({ coach }: { coach: Coach }) {
  const profileUrl = `${BASE_URL}/coaches/${coach.id}`;

  return (
    <Card className="p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-foreground">
          {coach.first_name} {coach.last_name}
        </span>
        <span className="text-sm text-default-400">{coach.coach_description}</span>
      </div>

      <div className="flex items-center justify-between">
        <StarRating rating={coach.avg_rating} reviewCount={coach.review_count} />
        <Link href={profileUrl} size="sm" className="font-medium text-foreground">
          View Profile
        </Link>
      </div>
    </Card>
  );
}
function SkeletonCard() {
  return (
    <Card className="p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-36 rounded-lg" />
        <Skeleton className="h-3 w-24 rounded-lg" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20 rounded-lg" />
        <Skeleton className="h-3 w-24 rounded-lg" />
      </div>
    </Card>
  );
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
    <section className="bg-default-100 px-16 py-12">
      {/* Header */}
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
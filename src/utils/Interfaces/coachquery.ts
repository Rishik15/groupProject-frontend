export interface CoachQuery {
  name: string;
  tags: string[];
  certified: boolean;
  max_price: number;
  rating: number;
  sort_by: string;
}

export interface Coach {
  coach_id: number;
  first_name: string;
  last_name: string;
  coach_description: string;
  avg_rating: number;
  review_count: number;
}

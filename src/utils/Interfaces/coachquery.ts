export interface CoachQuery {
  name: string;
  filters: string[];
  is_certified: boolean;
  max_price: number;
  min_rating: number;
  sort_by: string;
}

export interface Coach {
  coach_id: number;
  first_name: string;
  last_name: string;
  coach_description: string;
  price: number;
  avg_rating: number;
  review_count: number;
}

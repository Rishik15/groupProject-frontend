export type ProgressPhotoRecord = {
  progress_photo_id: number;
  user_id: number;
  photo_url: string;
  caption?: string | null;
  taken_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};
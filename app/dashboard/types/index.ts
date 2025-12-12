// src/app/dashboard/types/index.ts

export interface EventType {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  duration: number;
  location: string | null;
  availability_json: string | null;
}

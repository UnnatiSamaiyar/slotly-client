<<<<<<< HEAD
// src/app/dashboard/types/index.ts

export interface EventType {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  duration: number;
  location: string | null;
  availability_json: string | null;
=======
export interface CalendarEvent {
  id: string;
  summary: string;
  start: string | null;
  end: string | null;
  location?: string | null;
  htmlLink?: string | null;
  organizer?: string | null;

  // 🔥 REQUIRED
  meetLink?: string | null;
  attendees?: string[];
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
}

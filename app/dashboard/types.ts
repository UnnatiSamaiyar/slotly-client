// src/app/dashboard/types.ts
export type ISODate = string; // YYYY-MM-DD

export type UserProfile = {
  sub: string;
  name: string;
  email?: string;
  avatarUrl?: string | null;
  username?: string;

  // Booking Profile Data
  profile_title?: string | null;
  host_name?: string | null;
  timezone?: string | null;
  slug?: string | null;

  has_booking_profile?: boolean;
};


export type CalendarEvent = {
  id: string;
  summary: string;
  start: string | null; // ISO
  end: string | null; // ISO
  location?: string | null;
  htmlLink?: string | null;
  organizer?: string | null;

  // DB-backed booking extras
  meetLink?: string | null;
  attendees?: any[];

  // Role for dashboard filtering
  role?: "host" | "invitee" | "both" | "unknown";
};

// export type EventType = {
//   id: number;
//   title: string;
//   slug: string;
//   duration: number;
//   location?: string | null;
//   availability_json?: string | null;

//   // frontend-only (optional future customization)
//   color?: string;
// };

export type MeetingMode = "google_meet" | "in_person";

export type EventType = {
  id: number;
  user_id?: number;
  title: string;
  slug: string;

  meeting_mode: MeetingMode; // NEW
  location?: string | null;

  availability_json?: string | null;
  timezone?: string | null;

  // per-event duration (minutes)
  duration_minutes?: number | null;

  // optional fields if still present somewhere else
  created_at?: string;
};


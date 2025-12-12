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
};

export type EventType = {
  id: number;
  title: string;
  slug: string;
  duration: number;
  location?: string | null;
  availability_json?: string | null;

  // frontend-only (optional future customization)
  color?: string;
};


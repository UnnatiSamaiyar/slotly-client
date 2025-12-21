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
}

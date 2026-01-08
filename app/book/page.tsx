import { Suspense } from "react";
import BookingPageClient from "./BookingPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <BookingPageClient />
    </Suspense>
  );
}

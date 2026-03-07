// // import { Suspense } from "react";
// // import BookingPageClient from "./BookingPageClient";

// // export default function Page() {
// //   return (
// //     <Suspense fallback={<div className="p-6">Loading…</div>}>
// //       <BookingPageClient />
// //     </Suspense>
// //   );
// // // }
// // "use client";

// // import { useDashboardUser } from "../dashboard/layout";
// // import BookingPageClient from "./BookingPageClient";

// // export default function NewEventPage() {
// //   const { userSub } = useDashboardUser();

// //   return <BookingPageClient userSub={userSub} />;
// // }
// "use client";

// import DashboardLayout, { useDashboardUser } from "../dashboard/layout";
// import BookingPageClient from "./BookingPageClient";

// function BookInner() {
//   const { userSub } = useDashboardUser();
//   return <BookingPageClient userSub={userSub} />;
// }

// export default function NewEventPage() {
//   return (
//     <DashboardLayout>
//       <BookInner />
//     </DashboardLayout>
//   );
// }
"use client";

import DashboardLayout, { useDashboardUser } from "../dashboard/layout";
import BookingPageClient from "./BookingPageClient";

/* Inner component that consumes context */
function BookInner() {
  const { user, userSub } = useDashboardUser();

  return (
    <BookingPageClient
      user={user}
      userSub={userSub}
    />
  );
}

/* Page wrapped inside DashboardLayout */
export default function NewEventPage() {
  return (
    <DashboardLayout>
      <BookInner />
    </DashboardLayout>
  );
}
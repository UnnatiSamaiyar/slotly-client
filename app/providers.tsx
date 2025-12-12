// "use client";

// import { SessionProvider } from "next-auth/react";

// export function Providers({ children }: { children: React.ReactNode }) {
//   return <SessionProvider>{children}</SessionProvider>;
// }



// src/app/providers.tsx
"use client";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

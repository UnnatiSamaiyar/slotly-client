// // import "./globals.css";
// // import Providers from "./providers";
// // export default function RootLayout({ children }: { children: React.ReactNode }) {
// //   return (
// //     <html lang="en">
// //       <body>
// //         <Providers>{children}</Providers>
// //       </body>
// //     </html>
// //   );
// // }
// import "./globals.css";
// import type { Metadata } from "next";
// import Providers from "./providers";

// export const metadata: Metadata = {
//   title: "Slotly",
//   description: "Smart scheduling platform",
//   icons: {
//     icon: "/favicon.ico",
//     shortcut: "/favicon.ico",
//     apple: "/apple-touch-icon.png",
//   },
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }

import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "./providers";

const inter = localFont({
  src: "../public/fonts/InterVariable.ttf",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Slotly",
  description: "Smart scheduling platform",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
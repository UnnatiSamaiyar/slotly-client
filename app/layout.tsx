import "./globals.css";
// import { Providers } from "./providers";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <head></head>
//       <body>
//         <Providers>
//           {children}
//         </Providers>
//       </body>
//     </html>
//   );
// }

<<<<<<< HEAD

import Providers from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
=======
import Providers from "./providers";

export default function RootLayout({ children }) {
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

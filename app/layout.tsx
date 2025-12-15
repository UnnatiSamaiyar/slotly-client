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


import Providers from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

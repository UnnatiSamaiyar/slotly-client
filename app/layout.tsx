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
      <head>
      <meta name="google-site-verification" content="kcfXCAoRsUchh23GlVtrz0qlTjpINXrYz_DiE8oQhR4" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


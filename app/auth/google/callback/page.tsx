// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function GoogleCallbackPage() {
//   const router = useRouter();

//   useEffect(() => {
//     async function handle() {
//       const params = new URLSearchParams(window.location.search);
//       const code = params.get("code");

//       if (!code) return;

//       // CALL BACKEND
//       const res = await fetch("https://api.slotly.io/auth/google", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code }),
//       });

//       const data = await res.json();
//       console.log("Backend login data:", data);

//       if (data.error) {
//         alert("Login failed: " + data.error);
//         return;
//       }

//       // SAVE SESSION IN LOCALSTORAGE
//       localStorage.setItem("slotly_user", JSON.stringify({
//         sub: data.sub,
//         name: data.name,
//         email: data.email,
//         picture: data.picture,
//       }));

//       // REDIRECT TO DASHBOARD
//       router.push("/dashboard");
//     }

//     handle();
//   }, []);

//   return (
//     <div className="flex items-center justify-center h-screen text-lg">
//       Logging you in…
//     </div>
//   );
// }








"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handle() {
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) return;

      try {
        const res = await fetch("https://api.slotly.io/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ code })
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Backend error:", data);
          return;
        }

        // THIS IS WHERE LOGIN GETS STORED
        localStorage.setItem("slotly_user", JSON.stringify(data));

        router.push("/dashboard");
      } catch (err) {
        console.error("Callback failed:", err);
      }
    }

    handle();
  }, [router]);

  return <div>Logging you in...</div>;
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
<<<<<<< HEAD
    const res = await fetch("https://api.slotly.io/booking/create", {
=======
    const res = await fetch("http://localhost:8000/booking/create", {
>>>>>>> ed9d3d7 (public booking, participants data and  meeting link fetch, profile photo fetch)
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = await res.text();
    return new NextResponse(payload, { status: res.status, headers: { "Content-Type": "application/json" }});
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch("http://localhost:8000/booking/create", {
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

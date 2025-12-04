import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // --- VALIDATE INPUT ---
    if (!body || !body.text) {
      return NextResponse.json(
        { ok: false, error: "Missing required field: text" },
        { status: 400 }
      );
    }

    // --- CALL OPENAI OR VOICE ENGINE HERE ---
    // Placeholder success response
    return NextResponse.json(
      {
        ok: true,
        message: "Voice API processed successfully",
        input: body.text,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error in /api/voice POST:", err);

    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error in voice route",
        details: process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // simple health check
  return NextResponse.json({
    ok: true,
    route: "voice",
    status: "running",
  });
}

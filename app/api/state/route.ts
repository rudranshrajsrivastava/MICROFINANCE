import { NextResponse } from "next/server";
import { getDatabaseState, saveDatabaseState } from "@/lib/database";
import type { AppState } from "@/lib/types";

export async function GET() {
  try {
    const state = await getDatabaseState();
    if (!state) return NextResponse.json({ ok: false, reason: "DATABASE_URL missing" }, { status: 503 });
    return NextResponse.json({ ok: true, state });
  } catch (error) {
    console.error("Failed to load MySQL state", error);
    return NextResponse.json({ ok: false, reason: "Database unavailable" }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  try {
    const state = await request.json() as AppState;
    await saveDatabaseState(state);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save MySQL state", error);
    return NextResponse.json({ ok: false, reason: "Database unavailable" }, { status: 503 });
  }
}

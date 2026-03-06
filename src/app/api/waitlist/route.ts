import { NextRequest } from "next/server";
import { db, isDbAvailable } from "@/db";
import { waitlist } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { dbUnavailableResponse, jsonOk, jsonError } from "@/lib/api-utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  if (!isDbAvailable() || !db) return dbUnavailableResponse();

  let body: { email?: string; city?: string };
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON", 400);
  }

  const email = body.email?.trim().toLowerCase();
  const city = body.city?.trim().toLowerCase() || "paris";

  if (!email || !EMAIL_REGEX.test(email)) {
    return jsonError("Email invalide", 400);
  }

  try {
    // Check for duplicate
    const existing = await db
      .select({ id: waitlist.id })
      .from(waitlist)
      .where(and(eq(waitlist.email, email), eq(waitlist.city, city)))
      .limit(1);

    if (existing.length > 0) {
      return jsonOk({ ok: true, message: "already_registered" });
    }

    await db.insert(waitlist).values({ email, city });
    return jsonOk({ ok: true, message: "registered" });
  } catch (error) {
    console.error("[POST /api/waitlist]", error instanceof Error ? error.message : error);
    return jsonError("Erreur serveur", 500);
  }
}

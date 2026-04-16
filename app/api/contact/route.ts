import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const rateLimit = new Map<string, { count: number; ts: number }>();

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const entry = rateLimit.get(ip);
  const now = Date.now();

  if (entry && now - entry.ts < 3600_000 && entry.count >= 3) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }


  if (!name || !email || !message) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  rateLimit.set(ip, {
    count: entry && now - entry.ts < 3600_000 ? entry.count + 1 : 1,
    ts: entry && now - entry.ts < 3600_000 ? entry.ts : now,
  });

  const { error } = await resend.emails.send({
    from: "Contact <contact@axel-grelet.com>",
    // from: "Contact <onboarding@resend.dev>", // change après validation domaine
    to: "grelet.axel.85@gmail.com",              // ← ton email
    subject: `Nouveau message de ${name}`,
    text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error: "Erreur envoi" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
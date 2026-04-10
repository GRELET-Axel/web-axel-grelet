import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

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
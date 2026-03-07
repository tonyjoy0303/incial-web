import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

// Destination email — who receives contact form submissions
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "toincial@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, phone, company } = body;

    // ── Validate required fields ──────────────────────────────────────────────
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // ── Store submission in Neon DB ───────────────────────────────────────────
    await prisma.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        phone: phone?.trim() || null,
        company: company?.trim() || null,
      },
    });

    // ── Send notification email via Resend ────────────────────────────────────
    const { error: resendError } = await resend.emails.send({
      from: "Incial Contact <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email.trim(),
      subject: `New contact from ${name.trim()} — Incial`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #111; margin-bottom: 8px;">New Contact Form Submission</h2>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin-bottom: 24px;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 120px; vertical-align: top;">Name</td>
              <td style="padding: 8px 0; color: #111; font-weight: 600;">${name.trim()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Email</td>
              <td style="padding: 8px 0; color: #111;">
                <a href="mailto:${email.trim()}" style="color: #2563eb;">${email.trim()}</a>
              </td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Phone</td>
              <td style="padding: 8px 0; color: #111;">${phone.trim()}</td>
            </tr>` : ""}
            ${company ? `
            <tr>
              <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Company</td>
              <td style="padding: 8px 0; color: #111;">${company.trim()}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Message</td>
              <td style="padding: 8px 0; color: #111; white-space: pre-wrap;">${message.trim()}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin-top: 24px;" />
          <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
            Sent via Incial contact form at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
          </p>
        </div>
      `,
    });

    if (resendError) {
      // Log but don't fail — submission was already saved to DB
      console.error("Resend email error:", resendError);
    }

    return NextResponse.json(
      { message: "Your message has been received. We'll get back to you soon!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process your message. Please try again." },
      { status: 500 }
    );
  }
}

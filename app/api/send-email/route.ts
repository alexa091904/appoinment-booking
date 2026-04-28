import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    // Guard: check credentials are configured
    if (!emailUser || !emailPass || emailUser === 'your-email@gmail.com' || emailPass === 'your-app-password-here') {
      console.error('[send-email] Email credentials are not configured in .env.local');
      return NextResponse.json(
        { error: 'Email service is not configured. Please set EMAIL_USER and EMAIL_PASS in .env.local' },
        { status: 503 }
      );
    }

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields: to, subject, html' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Verify connection before sending
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Dr. Alexa Clinic" <${emailUser}>`,
      to,
      subject,
      html,
    });

    console.log('[send-email] Message sent:', info.messageId);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('[send-email] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

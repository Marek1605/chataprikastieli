import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, gdprConsent } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!gdprConsent) {
      return NextResponse.json(
        { success: false, error: 'GDPR consent required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const recipientEmail = process.env.CONTACT_EMAIL || 'info@chataprikastieli.sk';

    // If Resend is configured, send email
    if (resend) {
      await resend.emails.send({
        from: 'Chata pri Kaštieli <noreply@chataprikastieli.sk>',
        to: recipientEmail,
        replyTo: email,
        subject: `Nová správa od ${name}`,
        html: `
          <h2>Nová správa z webu Chata pri Kaštieli</h2>
          <p><strong>Meno:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Správa:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Odoslaný z kontaktného formulára na chataprikastieli.sk<br>
            GDPR súhlas: Áno
          </p>
        `,
        text: `
Nová správa z webu Chata pri Kaštieli

Meno: ${name}
Email: ${email}

Správa:
${message}

---
Odoslaný z kontaktného formulára na chataprikastieli.sk
GDPR súhlas: Áno
        `,
      });

      // Send confirmation to user
      await resend.emails.send({
        from: 'Chata pri Kaštieli <noreply@chataprikastieli.sk>',
        to: email,
        subject: 'Ďakujeme za vašu správu | Chata pri Kaštieli',
        html: `
          <h2>Ďakujeme za vašu správu</h2>
          <p>Dobrý deň ${name},</p>
          <p>Ďakujeme, že ste nás kontaktovali. Vašu správu sme prijali a ozveme sa vám čo najskôr.</p>
          <p>S pozdravom,<br>Chata pri Kaštieli</p>
        `,
      });
    } else {
      // Log for debugging when Resend is not configured
      console.log('Contact form submission (Resend not configured):', {
        name,
        email,
        message: message.substring(0, 100),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

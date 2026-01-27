import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      guests,
      note,
      gdprConsent,
      checkIn,
      checkOut,
      nights,
      estimatedPrice,
      language = 'sk',
    } = body;

    // Validation
    if (!name || !email || !phone || !checkIn || !checkOut) {
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

    // Language-specific labels
    const labels = {
      sk: {
        subject: 'Nový dopyt na rezerváciu',
        title: 'Nový dopyt na rezerváciu',
        from: 'Meno',
        emailLabel: 'Email',
        phoneLabel: 'Telefón',
        checkInLabel: 'Príchod',
        checkOutLabel: 'Odchod',
        nightsLabel: 'Počet nocí',
        guestsLabel: 'Počet hostí',
        priceLabel: 'Orientačná cena',
        noteLabel: 'Poznámka',
        langLabel: 'Jazyk',
        confirmTitle: 'Ďakujeme za váš dopyt',
        confirmText: 'Ďakujeme za váš záujem o Chatu pri Kaštieli. Váš dopyt sme prijali a ozveme sa vám do 24 hodín s potvrdením dostupnosti.',
      },
      en: {
        subject: 'New Booking Inquiry',
        title: 'New Booking Inquiry',
        from: 'Name',
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        checkInLabel: 'Check-in',
        checkOutLabel: 'Check-out',
        nightsLabel: 'Nights',
        guestsLabel: 'Guests',
        priceLabel: 'Estimated Price',
        noteLabel: 'Note',
        langLabel: 'Language',
        confirmTitle: 'Thank you for your inquiry',
        confirmText: 'Thank you for your interest in Chata pri Kaštieli. We have received your inquiry and will contact you within 24 hours to confirm availability.',
      },
      cs: {
        subject: 'Nová poptávka na rezervaci',
        title: 'Nová poptávka na rezervaci',
        from: 'Jméno',
        emailLabel: 'Email',
        phoneLabel: 'Telefon',
        checkInLabel: 'Příjezd',
        checkOutLabel: 'Odjezd',
        nightsLabel: 'Počet nocí',
        guestsLabel: 'Počet hostů',
        priceLabel: 'Orientační cena',
        noteLabel: 'Poznámka',
        langLabel: 'Jazyk',
        confirmTitle: 'Děkujeme za vaši poptávku',
        confirmText: 'Děkujeme za váš zájem o Chatu pri Kaštieli. Vaši poptávku jsme přijali a ozveme se vám do 24 hodin s potvrzením dostupnosti.',
      },
      pl: {
        subject: 'Nowe zapytanie rezerwacyjne',
        title: 'Nowe zapytanie rezerwacyjne',
        from: 'Imię',
        emailLabel: 'Email',
        phoneLabel: 'Telefon',
        checkInLabel: 'Przyjazd',
        checkOutLabel: 'Wyjazd',
        nightsLabel: 'Liczba nocy',
        guestsLabel: 'Liczba gości',
        priceLabel: 'Szacunkowa cena',
        noteLabel: 'Uwagi',
        langLabel: 'Język',
        confirmTitle: 'Dziękujemy za zapytanie',
        confirmText: 'Dziękujemy za zainteresowanie Chatą pri Kaštieli. Otrzymaliśmy Twoje zapytanie i skontaktujemy się w ciągu 24 godzin z potwierdzeniem dostępności.',
      },
    };

    const l = labels[language as keyof typeof labels] || labels.sk;

    // Format dates for display
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('sk-SK', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    };

    // If Resend is configured, send email
    if (resend) {
      // Send to owner
      await resend.emails.send({
        from: 'Chata pri Kaštieli <noreply@chataprikastieli.sk>',
        to: recipientEmail,
        replyTo: email,
        subject: `${l.subject}: ${formatDate(checkIn)} - ${formatDate(checkOut)}`,
        html: `
          <h2>${l.title}</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${l.from}:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${l.emailLabel}:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${l.phoneLabel}:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${l.checkInLabel}:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatDate(checkIn)}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${l.checkOutLabel}:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatDate(checkOut)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${l.nightsLabel}:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${nights}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${l.guestsLabel}:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${guests}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${l.priceLabel}:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${estimatedPrice}€</td>
            </tr>
            ${note ? `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${l.noteLabel}:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${note}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px;"><strong>${l.langLabel}:</strong></td>
              <td style="padding: 8px;">${language.toUpperCase()}</td>
            </tr>
          </table>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Odoslaný z rezervačného formulára na chataprikastieli.sk<br>
            GDPR súhlas: Áno
          </p>
        `,
      });

      // Send confirmation to customer
      await resend.emails.send({
        from: 'Chata pri Kaštieli <noreply@chataprikastieli.sk>',
        to: email,
        subject: l.confirmTitle,
        html: `
          <h2>${l.confirmTitle}</h2>
          <p>${l.confirmText}</p>
          <h3>Zhrnutie:</h3>
          <ul>
            <li><strong>${l.checkInLabel}:</strong> ${formatDate(checkIn)}</li>
            <li><strong>${l.checkOutLabel}:</strong> ${formatDate(checkOut)}</li>
            <li><strong>${l.nightsLabel}:</strong> ${nights}</li>
            <li><strong>${l.guestsLabel}:</strong> ${guests}</li>
            <li><strong>${l.priceLabel}:</strong> ${estimatedPrice}€</li>
          </ul>
          <p>S pozdravom,<br>Chata pri Kaštieli</p>
        `,
      });
    } else {
      // Log for debugging when Resend is not configured
      console.log('Booking form submission (Resend not configured):', {
        name,
        email,
        phone,
        checkIn,
        checkOut,
        nights,
        guests,
        estimatedPrice,
        language,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Booking inquiry sent successfully',
    });
  } catch (error) {
    console.error('Booking form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send booking inquiry' },
      { status: 500 }
    );
  }
}

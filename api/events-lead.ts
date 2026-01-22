// /api/events-lead.ts
import { Resend } from 'resend';

// ✅ Solo para desarrollo local (vercel dev)
// En producción Vercel ignora esto y usa Environment Variables del dashboard
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: '.env.local' });
}

type ReqLike = { method?: string; body?: any };
type ResLike = { status: (code: number) => ResLike; json: (data: any) => void };

export default async function handler(req: ReqLike, res: ResLike) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_KEY) {
      return res.status(500).json({ message: 'Missing RESEND_API_KEY' });
    }

    const resend = new Resend(RESEND_KEY);

    const {
      recipientEmail,
      subject,
      name,
      email,
      phone,
      eventDate,
      eventPlace,
      peopleCount,
      details,
    } = req.body || {};

    const to = String(recipientEmail || '').trim();
    if (!to) return res.status(400).json({ message: 'Missing recipientEmail' });
    if (!/^\S+@\S+\.\S+$/.test(to)) {
      return res.status(400).json({ message: 'Invalid recipientEmail' });
    }

    const senderName = String(name || '').trim();
    const senderEmail = String(email || '').trim();
    const senderPhone = String(phone || '').trim();

    if (!senderName || !senderEmail || !senderPhone) {
      return res.status(400).json({ message: 'Missing name/email/phone' });
    }

    const _eventDate = String(eventDate || '').trim();
    const _eventPlace = String(eventPlace || '').trim();
    const _peopleCount = String(peopleCount || '').trim();
    const _details = String(details || '').trim();

    if (!_eventDate || !_eventPlace || !_peopleCount || !_details) {
      return res.status(400).json({ message: 'Missing event fields' });
    }

    const safe = (v: any) => String(v || '').replace(/[<>]/g, '');

    const html = `
      <h2>Nueva solicitud de evento</h2>
      <p><strong>Nombre:</strong> ${safe(senderName)}</p>
      <p><strong>Correo:</strong> ${safe(senderEmail)}</p>
      <p><strong>Teléfono:</strong> ${safe(senderPhone)}</p>
      <p><strong>Fecha del evento:</strong> ${safe(_eventDate)}</p>
      <p><strong>Lugar del evento:</strong> ${safe(_eventPlace)}</p>
      <p><strong>Personas:</strong> ${safe(_peopleCount)}</p>
      <p><strong>Detalles:</strong><br/>${safe(_details).replace(/\n/g, '<br/>')}</p>
    `;

    const result = await resend.emails.send({
      from: 'Mitica <no-reply@miticaburgers.com>',
      to,
      replyTo: senderEmail,
      subject: subject || 'Nueva solicitud de evento',
      html,
    });

    // @ts-ignore
    if (result?.error) {
      // @ts-ignore
      return res.status(400).json({ message: result.error.message, error: result.error });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || 'Server error' });
  }
}

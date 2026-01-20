// api/franchise-lead.ts
import { Resend } from 'resend'

// ✅ Solo para desarrollo local (vercel dev)
// En producción Vercel ignora esto y usa Environment Variables del dashboard
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: '.env.local' })
}

type ReqLike = { method?: string; body?: any }
type ResLike = { status: (code: number) => ResLike; json: (data: any) => void }

export default async function handler(req: ReqLike, res: ResLike) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  try {
    const RESEND_KEY = process.env.RESEND_API_KEY
    if (!RESEND_KEY) {
      return res.status(500).json({ message: 'Missing RESEND_API_KEY' })
    }

    const resend = new Resend(RESEND_KEY)

    const { recipientEmail, subject, name, email, city, phone } = req.body || {}

    const to = String(recipientEmail || '').trim()
    if (!to) return res.status(400).json({ message: 'Missing recipientEmail' })
    if (!/^\S+@\S+\.\S+$/.test(to)) {
      return res.status(400).json({ message: 'Invalid recipientEmail' })
    }

    const senderName = String(name || '').trim()
    const senderEmail = String(email || '').trim()

    if (!senderName || !senderEmail) {
      return res.status(400).json({ message: 'Missing name/email' })
    }

    const safe = (v: any) => String(v || '').replace(/[<>]/g, '')

    const html = `
      <h2>Nueva solicitud de franquicia</h2>
      <p><strong>Nombre:</strong> ${safe(senderName)}</p>
      <p><strong>Correo:</strong> ${safe(senderEmail)}</p>
      <p><strong>Ciudad:</strong> ${safe(city) || '-'}</p>
      <p><strong>Teléfono:</strong> ${safe(phone) || '-'}</p>
    `

    const result = await resend.emails.send({
      from: 'Mitica <no-reply@miticaburgers.com>',
      to,
      replyTo: senderEmail,
      subject: subject || 'Nueva solicitud de franquicia',
      html,
    })

    // @ts-ignore
    if (result?.error) {
      // @ts-ignore
      return res.status(400).json({ message: result.error.message, error: result.error })
    }

    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || 'Server error' })
  }
}

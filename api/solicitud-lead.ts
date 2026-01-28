// api/solicitud-lead.ts
import { Resend } from 'resend'
import formidable, { type Files, type Fields } from 'formidable'
import fs from 'node:fs/promises'

type ReqLike = any
type ResLike = { status: (code: number) => ResLike; json: (data: any) => void }

const DEFAULT_MAX_MB = 8
const DEFAULT_MAX_BYTES = DEFAULT_MAX_MB * 1024 * 1024

const safe = (v: any) => String(v ?? '').replace(/[<>]/g, '').trim()

function asString(v: any): string {
  if (Array.isArray(v)) return String(v[0] ?? '')
  return String(v ?? '')
}

function asStringArray(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v.map((x) => String(x)).filter(Boolean)
  return String(v)
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
}

function parseForm(req: ReqLike, maxBytes: number) {
  const form = formidable({
    multiples: true,
    maxFileSize: maxBytes,
    allowEmptyFiles: false,
    // solo PDF
    filter: ({ mimetype }) => {
      if (!mimetype) return false
      return mimetype === 'application/pdf'
    },
  })

  return new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })
}

export default async function handler(req: ReqLike, res: ResLike) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  try {
    const RESEND_KEY = process.env.RESEND_API_KEY
    if (!RESEND_KEY) return res.status(500).json({ message: 'Missing RESEND_API_KEY' })

    // max size opcional (viene del front)
    const maxFileSizeMbRaw = req?.headers?.['x-max-file-mb']
    const maxFileSizeMb =
      typeof maxFileSizeMbRaw === 'string' && Number(maxFileSizeMbRaw) > 0
        ? Number(maxFileSizeMbRaw)
        : DEFAULT_MAX_MB
    const maxBytes = Math.min(Math.max(maxFileSizeMb, 1), 20) * 1024 * 1024

    const { fields, files } = await parseForm(req, maxBytes)

    const recipientEmail = safe(asString(fields.recipientEmail))
    const subject = safe(asString(fields.subject)) || 'Nueva solicitud de bolsa de trabajo'

    if (!recipientEmail) return res.status(400).json({ message: 'Missing recipientEmail' })
    if (!/^\S+@\S+\.\S+$/.test(recipientEmail)) {
      return res.status(400).json({ message: 'Invalid recipientEmail' })
    }

    const firstNames = safe(asString(fields.firstNames))
    const lastNames = safe(asString(fields.lastNames))
    const email = safe(asString(fields.email))
    const phone = safe(asString(fields.phone))
    const city = safe(asString(fields.city))
    const availability = safe(asString(fields.availability)) // Matutino/Vespertino
    const positions = asStringArray(fields.positions)
    const employmentTypes = asStringArray(fields.employmentTypes)

    const privacyAcceptedRaw = asString(fields.privacyAccepted)
    const privacyAccepted =
      privacyAcceptedRaw === 'true' || privacyAcceptedRaw === 'on' || privacyAcceptedRaw === '1'

    if (!firstNames || !lastNames || !email || !phone || !city || !availability) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (!positions.length) return res.status(400).json({ message: 'Missing positions' })
    if (!employmentTypes.length) return res.status(400).json({ message: 'Missing employmentTypes' })

    if (!privacyAccepted) {
      return res.status(400).json({ message: 'Privacy consent is required' })
    }

    // ✅ CV PDF (input name: "cv")
    const fileAny: any = (files as any)?.cv
    const file = Array.isArray(fileAny) ? fileAny[0] : fileAny

    if (!file) return res.status(400).json({ message: 'Missing CV (PDF)' })
    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'CV must be a PDF' })
    }
    if (typeof file.size === 'number' && file.size > maxBytes) {
      return res
        .status(400)
        .json({ message: `CV too large (max ${Math.floor(maxBytes / 1024 / 1024)}MB)` })
    }

    const fileBuffer = await fs.readFile(file.filepath)
    const originalName = safe(file.originalFilename || 'cv.pdf') || 'cv.pdf'
    const filename = originalName.toLowerCase().endsWith('.pdf') ? originalName : `${originalName}.pdf`

    const resend = new Resend(RESEND_KEY)

    const html = `
      <h2>Nueva solicitud de bolsa de trabajo</h2>
      <p><strong>Nombre(s):</strong> ${safe(firstNames)}</p>
      <p><strong>Apellidos:</strong> ${safe(lastNames)}</p>
      <p><strong>Correo:</strong> ${safe(email)}</p>
      <p><strong>Teléfono/WhatsApp:</strong> ${safe(phone)}</p>
      <p><strong>Puestos de interés:</strong> ${positions.map(safe).join(', ')}</p>
      <p><strong>Ciudad / Sucursal:</strong> ${safe(city)}</p>
      <p><strong>Disponibilidad:</strong> ${safe(availability)}</p>
      <p><strong>Tipo de empleo:</strong> ${employmentTypes.map(safe).join(', ')}</p>
      <p><strong>Aceptó aviso de privacidad:</strong> ${privacyAccepted ? 'Sí' : 'No'}</p>
      <hr/>
      <p><em>CV adjunto en PDF.</em></p>
    `

    const result = await resend.emails.send({
      from: 'Mitica <no-reply@miticaburgers.com>',
      to: recipientEmail,
      replyTo: email,
      subject,
      html,
      attachments: [
        {
          filename,
          content: fileBuffer, // ✅ Buffer (sin "type", evita error TS y es mejor para prod)
        },
      ],
    })

    // @ts-ignore
    if (result?.error) {
      // @ts-ignore
      return res.status(400).json({ message: result.error.message, error: result.error })
    }

    return res.status(200).json({ ok: true })
  } catch (e: any) {
    const msg = e?.message || 'Server error'
    return res.status(500).json({ message: msg })
  }
}

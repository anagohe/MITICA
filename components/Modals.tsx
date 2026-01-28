// src/components/Modals.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Title, TitleVariant } from './Typography';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const t = (title || '').toLowerCase();
  const isLightForm = t.includes('cotizar') || t.includes('patrocini');
  const isEventModal = t.includes('cotizar');

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            {/* ✅ Menos alto + scroll interno */}
            <div
              className={`w-full max-w-xl rounded-lg shadow-2xl pointer-events-auto relative overflow-hidden max-h-[85vh] ${
                isLightForm ? 'bg-[#F7F1DD]' : 'bg-gray-100'
              }`}
            >
              <button onClick={onClose} className="absolute top-4 right-4 text-black hover:opacity-70">
                <X size={24} />
              </button>

              {/* ✅ Scroll del contenido */}
              <div className={`${isEventModal ? 'p-5 md:p-6' : 'p-7 md:p-8'} overflow-y-auto max-h-[85vh]`}>
                {isLightForm ? (
                  <div className={isEventModal ? 'mb-2 text-left' : 'mb-3 text-left'}>
                    <h2 className="font-nexa uppercase text-[#F6BA27] text-lg md:text-2xl tracking-tight">
                      {title}
                    </h2>
                  </div>
                ) : (
                  <div className="mb-6 text-center">
                    <Title
                      variant={TitleVariant.REGULAR}
                      text={title}
                      color="text-mitica-black"
                      className="text-3xl mb-2"
                    />
                    <div className="w-16 h-1 bg-mitica-yellow mx-auto" />
                  </div>
                )}

                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export type FixedEventFormConfig = {
  recipientEmail?: string;
  introText?: string;
  requiredNote?: string;
  submitText?: string;

  fullNameLabel?: string;
  phoneLabel?: string;
  emailLabel?: string;
  eventDateLabel?: string;
  eventPlaceLabel?: string;
  peopleCountLabel?: string;
  detailsLabel?: string;
};

export type FixedSponsorFormConfig = {
  recipientEmail?: string;
  introText?: string;
  requiredNote?: string;
  submitText?: string;

  fullNameLabel?: string;
  phoneLabel?: string;
  emailLabel?: string;
  eventDateLabel?: string;
  eventPlaceLabel?: string;
  peopleCountLabel?: string;
  detailsLabel?: string;
};

// ✅ NUEVO: config para Bolsa de Trabajo
export type CareersLeadFormConfig = {
  modalTitle?: string;
  introText?: string;
  requiredNote?: string;
  submitText?: string;
  successText?: string;
  errorText?: string;

  firstNamesLabel?: string;
  lastNamesLabel?: string;
  emailLabel?: string;
  phoneLabel?: string;

  positionsLabel?: string;
  positionsOptions?: string[];

  cityLabel?: string;

  availabilityLabel?: string;
  availabilityOptions?: string[];

  employmentTypesLabel?: string;
  employmentTypesOptions?: string[];

  cvLabel?: string;
  fileNote?: string;
  maxFileSizeMb?: number;

  privacyLabel?: string;

  recipientEmail?: string;
  emailSubject?: string;
};

export const ContactForm = ({
  type,
  config,
}: {
  type: 'event' | 'sponsor' | 'solicitud';
  config?: FixedEventFormConfig | FixedSponsorFormConfig | CareersLeadFormConfig;
}) => {
  const labelLight = 'block text-xs font-extrabold text-black mb-2';

  const inputLight =
    'w-full bg-[#EFEFEF] border border-black/10 px-4 py-2 rounded-lg outline-none focus:border-black/20 focus:ring-2 focus:ring-black/10 shadow-sm';

  // ===========================
  // ✅ NUEVO: FORM SOLICITUD (CAREERS)
  // ===========================
  if (type === 'solicitud') {
    const c = config as CareersLeadFormConfig | undefined;

    const introText = c?.introText || 'Completa tu solicitud y adjunta tu CV (PDF).';
    const requiredNote = c?.requiredNote || '*Todos los campos son obligatorios.*';
    const submitText = c?.submitText || 'Enviar solicitud';
    const successText = c?.successText || '¡Listo! Tu solicitud fue enviada.';
    const errorText = c?.errorText || 'No se pudo enviar. Intenta de nuevo.';

    const maxMb = typeof c?.maxFileSizeMb === 'number' && c.maxFileSizeMb > 0 ? c.maxFileSizeMb : 8;
    const maxBytes = maxMb * 1024 * 1024;

    const labels = {
      firstNames: c?.firstNamesLabel || 'Nombre(s)',
      lastNames: c?.lastNamesLabel || 'Apellidos',
      email: c?.emailLabel || 'Correo electrónico',
      phone: c?.phoneLabel || 'Teléfono / WhatsApp',
      positions: c?.positionsLabel || 'Puestos o vacante de interés',
      city: c?.cityLabel || 'Ciudad (o especificar sucursal)',
      availability: c?.availabilityLabel || 'Disponibilidad de horario',
      employmentTypes: c?.employmentTypesLabel || 'Tipo de empleo',
      cv: c?.cvLabel || 'CV (PDF)',
      privacy: c?.privacyLabel || 'Acepto el aviso de privacidad y el uso de mis datos para fines de reclutamiento.',
      fileNote: c?.fileNote || `Formatos permitidos (PDF) y tamaño máximo: ${maxMb} MB.`,
    };

    const positionsOptions = Array.isArray(c?.positionsOptions) ? c!.positionsOptions! : [];
    const employmentOptions = Array.isArray(c?.employmentTypesOptions) ? c!.employmentTypesOptions! : [];
    const availabilityOptions =
      Array.isArray(c?.availabilityOptions) && c!.availabilityOptions!.length
        ? c!.availabilityOptions!
        : ['Matutino', 'Vespertino'];

    const [values, setValues] = useState({
      firstNames: '',
      lastNames: '',
      email: '',
      phone: '',
      city: '',
      availability: availabilityOptions[0] || 'Matutino',
      privacyAccepted: false,
    });

    const [positions, setPositions] = useState<string[]>([]);
    const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
    const [cvFile, setCvFile] = useState<File | null>(null);

    const [openPositions, setOpenPositions] = useState(false);
    const [openEmployment, setOpenEmployment] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'idle' | 'error' | 'success'; text: string }>({
      type: 'idle',
      text: '',
    });

    const setIdle = () => {
      if (message.type !== 'idle') setMessage({ type: 'idle', text: '' });
    };

    const toggleMulti = (arr: string[], setter: (v: string[]) => void, item: string) => {
      setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
      setIdle();
    };

    const onPickCv = (file: File | null) => {
      setIdle();
      if (!file) {
        setCvFile(null);
        return;
      }
      if (file.type !== 'application/pdf') {
        setMessage({ type: 'error', text: 'El CV debe ser PDF.' });
        setCvFile(null);
        return;
      }
      if (file.size > maxBytes) {
        setMessage({ type: 'error', text: `El CV excede el tamaño máximo (${maxMb} MB).` });
        setCvFile(null);
        return;
      }
      setCvFile(file);
    };

    const validate = () => {
      const missing: string[] = [];
      if (!values.firstNames.trim()) missing.push('Nombre(s)');
      if (!values.lastNames.trim()) missing.push('Apellidos');
      if (!values.email.trim()) missing.push('Correo');
      if (!values.phone.trim()) missing.push('Teléfono');
      if (!positions.length) missing.push('Puestos');
      if (!values.city.trim()) missing.push('Ciudad/Sucursal');
      if (!values.availability.trim()) missing.push('Disponibilidad');
      if (!employmentTypes.length) missing.push('Tipo de empleo');
      if (!cvFile) missing.push('CV (PDF)');
      if (!values.privacyAccepted) missing.push('Aviso de privacidad');

      if (missing.length) {
        setMessage({ type: 'error', text: `Faltan campos: ${missing.join(', ')}` });
        return false;
      }
      return true;
    };

    const submit = async () => {
      if (isSubmitting) return;

      if (!validate()) return;

      const recipientEmail = String(c?.recipientEmail || '').trim();
      const subject = String(c?.emailSubject || 'Nueva solicitud de bolsa de trabajo').trim();

      if (!recipientEmail) {
        setMessage({ type: 'error', text: 'Falta recipientEmail en Sanity para este formulario.' });
        return;
      }

      try {
        setIsSubmitting(true);
        setMessage({ type: 'idle', text: '' });

        const fd = new FormData();
        fd.append('recipientEmail', recipientEmail);
        fd.append('subject', subject);

        fd.append('firstNames', values.firstNames);
        fd.append('lastNames', values.lastNames);
        fd.append('email', values.email);
        fd.append('phone', values.phone);
        fd.append('city', values.city);
        fd.append('availability', values.availability);

        positions.forEach((p) => fd.append('positions', p));
        employmentTypes.forEach((t) => fd.append('employmentTypes', t));

        fd.append('privacyAccepted', values.privacyAccepted ? 'true' : 'false');
        if (cvFile) fd.append('cv', cvFile);

        const res = await fetch('/api/solicitud-lead', {
          method: 'POST',
          body: fd,
          headers: {
            'x-max-file-mb': String(maxMb),
          },
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          setMessage({ type: 'error', text: json?.message || `Error ${res.status}: ${errorText}` });
          return;
        }

        setValues({
          firstNames: '',
          lastNames: '',
          email: '',
          phone: '',
          city: '',
          availability: availabilityOptions[0] || 'Matutino',
          privacyAccepted: false,
        });
        setPositions([]);
        setEmploymentTypes([]);
        setCvFile(null);
        setOpenPositions(false);
        setOpenEmployment(false);

        setMessage({ type: 'success', text: successText });
      } catch (e: any) {
        setMessage({ type: 'error', text: e?.message || errorText });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <form
        className="font-rethink space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <p className="text-xs md:text-sm text-black/80 font-semibold text-left leading-snug">
          {introText}
        </p>

        <p className="text-xs italic text-[#F6BA27] text-left">
          {requiredNote}
        </p>

        {message.type !== 'idle' && (
          <p
            className={
              message.type === 'error'
                ? 'text-xs font-semibold text-red-600 text-left'
                : 'text-xs font-semibold text-green-700 text-left'
            }
          >
            {message.text}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelLight}>{labels.firstNames}</label>
            <input
              type="text"
              className={inputLight}
              value={values.firstNames}
              onChange={(e) => {
                setValues((p) => ({ ...p, firstNames: e.target.value }));
                setIdle();
              }}
            />
          </div>

          <div>
            <label className={labelLight}>{labels.lastNames}</label>
            <input
              type="text"
              className={inputLight}
              value={values.lastNames}
              onChange={(e) => {
                setValues((p) => ({ ...p, lastNames: e.target.value }));
                setIdle();
              }}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelLight}>{labels.email}</label>
            <input
              type="email"
              className={inputLight}
              value={values.email}
              onChange={(e) => {
                setValues((p) => ({ ...p, email: e.target.value }));
                setIdle();
              }}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelLight}>{labels.phone}</label>
            <input
              type="tel"
              className={inputLight}
              value={values.phone}
              onChange={(e) => {
                setValues((p) => ({ ...p, phone: e.target.value }));
                setIdle();
              }}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelLight}>{labels.positions}</label>

            <button
              type="button"
              onClick={() => {
                setOpenPositions((v) => !v);
                setIdle();
              }}
              className={`${inputLight} text-left flex items-center justify-between`}
            >
              <span className="text-black/80">
                {positions.length ? `${positions.length} seleccionados` : 'Selecciona opciones'}
              </span>
              <span className="text-black/50 text-xs">▼</span>
            </button>

            {openPositions && (
              <div className="mt-2 rounded-lg border border-black/10 bg-white p-3 max-h-48 overflow-auto">
                {positionsOptions.length ? (
                  positionsOptions.map((opt, idx) => (
                    <label key={idx} className="flex items-center gap-3 py-1 text-sm">
                      <input
                        type="checkbox"
                        checked={positions.includes(opt)}
                        onChange={() => toggleMulti(positions, setPositions, opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-black/60">Configura opciones en Sanity.</p>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelLight}>{labels.city}</label>
            <input
              type="text"
              className={inputLight}
              value={values.city}
              onChange={(e) => {
                setValues((p) => ({ ...p, city: e.target.value }));
                setIdle();
              }}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelLight}>{labels.availability}</label>
            <div className="flex flex-wrap gap-4">
              {availabilityOptions.map((opt, idx) => (
                <label key={idx} className="flex items-center gap-2 text-sm text-black/80">
                  <input
                    type="radio"
                    name="availability"
                    checked={values.availability === opt}
                    onChange={() => {
                      setValues((p) => ({ ...p, availability: opt }));
                      setIdle();
                    }}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelLight}>{labels.employmentTypes}</label>

            <button
              type="button"
              onClick={() => {
                setOpenEmployment((v) => !v);
                setIdle();
              }}
              className={`${inputLight} text-left flex items-center justify-between`}
            >
              <span className="text-black/80">
                {employmentTypes.length ? `${employmentTypes.length} seleccionados` : 'Selecciona opciones'}
              </span>
              <span className="text-black/50 text-xs">▼</span>
            </button>

            {openEmployment && (
              <div className="mt-2 rounded-lg border border-black/10 bg-white p-3 max-h-48 overflow-auto">
                {employmentOptions.length ? (
                  employmentOptions.map((opt, idx) => (
                    <label key={idx} className="flex items-center gap-3 py-1 text-sm">
                      <input
                        type="checkbox"
                        checked={employmentTypes.includes(opt)}
                        onChange={() => toggleMulti(employmentTypes, setEmploymentTypes, opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-black/60">Configura opciones en Sanity.</p>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelLight}>{labels.cv}</label>
            <input
              type="file"
              accept="application/pdf"
              className={inputLight}
              onChange={(e) => onPickCv(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-black/60 mt-2">{labels.fileNote}</p>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-start gap-3 text-sm text-black/80">
              <input
                type="checkbox"
                checked={values.privacyAccepted}
                onChange={(e) => {
                  setValues((p) => ({ ...p, privacyAccepted: e.target.checked }));
                  setIdle();
                }}
                className="mt-1"
              />
              <span>{labels.privacy}</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-[#F6BA27] text-black font-nexa uppercase py-3 rounded-lg transition-opacity shadow-md ${
            isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-95'
          }`}
        >
          {isSubmitting ? 'Enviando...' : submitText}
        </button>
      </form>
    );
  }

  // ===========================
  // ✅ TU FORM ORIGINAL (EVENT/SPONSOR) SIN CAMBIOS
  // ===========================
  const introText =
    (config as any)?.introText ||
    'Llena nuestro formulario y nos pondremos en contacto contigo lo antes posible para crear un menú a la medida de tu evento.';
  const requiredNote = (config as any)?.requiredNote || '*Todos los campos son obligatorios.*';
  const submitText = (config as any)?.submitText || 'Enviar solicitud';

  const labels = useMemo(() => {
    const c = config as (FixedEventFormConfig | FixedSponsorFormConfig) | undefined;
    return {
      fullName: c?.fullNameLabel || 'Nombre completo:',
      phone: c?.phoneLabel || 'Teléfono:',
      email: c?.emailLabel || 'Correo electrónico:',
      eventDate: c?.eventDateLabel || 'Fecha del evento:',
      eventPlace: c?.eventPlaceLabel || 'Lugar del evento:',
      peopleCount: c?.peopleCountLabel || 'Cantidad de personas que asistirán a tu evento:',
      details: c?.detailsLabel || 'Cuéntanos más acerca de tu evento...',
    };
  }, [config]);

  const [values, setValues] = useState<Record<string, string>>({
    fullName: '',
    phone: '',
    email: '',
    eventDate: '',
    eventPlace: '',
    peopleCount: '',
    details: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'idle' | 'error' | 'success'; text: string }>({
    type: 'idle',
    text: '',
  });

  const handleChange = (key: string, val: string) => {
    setValues((p) => ({ ...p, [key]: val }));
    if (message.type !== 'idle') setMessage({ type: 'idle', text: '' });
  };

  const validate = () => {
    const missing: string[] = [];
    if (!values.fullName.trim()) missing.push('Nombre');
    if (!values.phone.trim()) missing.push('Teléfono');
    if (!values.email.trim()) missing.push('Correo');
    if (!values.eventDate.trim()) missing.push('Fecha');
    if (!values.eventPlace.trim()) missing.push('Lugar');
    if (!values.peopleCount.trim()) missing.push('Personas');
    if (!values.details.trim()) missing.push('Detalles');

    if (missing.length) {
      setMessage({ type: 'error', text: `Faltan campos: ${missing.join(', ')}` });
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (isSubmitting) return;

    if (!validate()) return;

    const recipientEmail = String((config as any)?.recipientEmail || '').trim();
    if (!recipientEmail) {
      setMessage({ type: 'error', text: 'Falta recipientEmail en Sanity para este formulario.' });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage({ type: 'idle', text: '' });

      const endpoint = type === 'event' ? '/api/events-lead' : '/api/sponsor-lead';

      const body =
        type === 'event'
          ? {
              recipientEmail,
              subject: 'Nueva solicitud de evento',
              name: values.fullName,
              email: values.email,
              phone: values.phone,
              eventDate: values.eventDate,
              eventPlace: values.eventPlace,
              peopleCount: values.peopleCount,
              details: values.details,
            }
          : {
              recipientEmail,
              subject: 'Nueva solicitud de patrocinio',
              name: values.fullName,
              email: values.email,
              phone: values.phone,
              eventDate: values.eventDate,
              eventPlace: values.eventPlace,
              peopleCount: values.peopleCount,
              details: values.details,
            };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage({ type: 'error', text: json?.message || `Error ${res.status}: No se pudo enviar.` });
        return;
      }

      setValues({
        fullName: '',
        phone: '',
        email: '',
        eventDate: '',
        eventPlace: '',
        peopleCount: '',
        details: '',
      });

      setMessage({ type: 'success', text: '¡Listo! Tu solicitud fue enviada.' });
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Error enviando formulario.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="font-rethink space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <p className="text-xs md:text-sm text-black/80 font-semibold text-left leading-snug">
        {introText}
      </p>

      <p className="text-xs italic text-[#F6BA27] text-left">
        {requiredNote}
      </p>

      {message.type !== 'idle' && (
        <p
          className={
            message.type === 'error'
              ? 'text-xs font-semibold text-red-600 text-left'
              : 'text-xs font-semibold text-green-700 text-left'
          }
        >
          {message.text}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelLight}>{labels.fullName}</label>
          <input
            type="text"
            className={inputLight}
            value={values.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
        </div>

        <div>
          <label className={labelLight}>{labels.phone}</label>
          <input
            type="tel"
            className={inputLight}
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelLight}>{labels.email}</label>
          <input
            type="email"
            className={inputLight}
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>

        <div>
          <label className={labelLight}>{labels.eventDate}</label>
          <input
            type="text"
            className={inputLight}
            value={values.eventDate}
            onChange={(e) => handleChange('eventDate', e.target.value)}
          />
        </div>

        <div>
          <label className={labelLight}>{labels.eventPlace}</label>
          <input
            type="text"
            className={inputLight}
            value={values.eventPlace}
            onChange={(e) => handleChange('eventPlace', e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelLight}>{labels.peopleCount}</label>
          <input
            type="text"
            className={inputLight}
            value={values.peopleCount}
            onChange={(e) => handleChange('peopleCount', e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelLight}>{labels.details}</label>
          <textarea
            className={`${inputLight} min-h-[60px] resize-none`}
            value={values.details}
            onChange={(e) => handleChange('details', e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-[#F6BA27] text-black font-nexa uppercase py-3 rounded-lg transition-opacity shadow-md ${
          isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-95'
        }`}
      >
        {isSubmitting ? 'Enviando...' : submitText}
      </button>
    </form>
  );
};

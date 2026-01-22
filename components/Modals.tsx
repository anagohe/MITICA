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
            <div
              className={`w-full max-w-xl rounded-lg shadow-2xl pointer-events-auto relative ${
                isLightForm ? 'bg-[#F7F1DD]' : 'bg-gray-100'
              }`}
            >
              <button onClick={onClose} className="absolute top-4 right-4 text-black hover:opacity-70">
                <X size={24} />
              </button>

              <div className={isEventModal ? 'p-5 md:p-6' : 'p-7 md:p-8'}>
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

export const ContactForm = ({
  type,
  config,
}: {
  type: 'event' | 'sponsor';
  config?: FixedEventFormConfig | FixedSponsorFormConfig;
}) => {
  const introText =
    config?.introText ||
    'Llena nuestro formulario y nos pondremos en contacto contigo lo antes posible para crear un menú a la medida de tu evento.';
  const requiredNote = config?.requiredNote || '*Todos los campos son obligatorios.*';
  const submitText = config?.submitText || 'Enviar solicitud';

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

  const labelLight = 'block text-xs font-extrabold text-black mb-2';

  const inputLight =
    'w-full bg-[#EFEFEF] border border-black/10 px-4 py-2 rounded-lg outline-none focus:border-black/20 focus:ring-2 focus:ring-black/10 shadow-sm';

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

    // ✅ Validación con mensaje visible
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

      // ✅ success → reset
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

      {/* ✅ Mensaje visible (para que no “parezca que no hace nada”) */}
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

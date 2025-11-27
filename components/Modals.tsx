import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Title, TitleVariant, BodyText } from './Typography';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl pointer-events-auto relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
              >
                <X size={24} />
              </button>
              
              <div className="p-8">
                <div className="mb-6 text-center">
                   <Title variant={TitleVariant.REGULAR} text={title} color="text-mitica-black" className="text-3xl mb-2" />
                   <div className="w-16 h-1 bg-mitica-yellow mx-auto"></div>
                </div>
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const ContactForm = ({ type }: { type: 'event' | 'job' }) => {
  return (
    <form className="space-y-4 font-rethink">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase mb-1">Nombre Completo</label>
          <input type="text" className="w-full bg-white border border-gray-300 p-2 rounded focus:border-mitica-yellow outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase mb-1">Teléfono</label>
          <input type="tel" className="w-full bg-white border border-gray-300 p-2 rounded focus:border-mitica-yellow outline-none transition-colors" />
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-bold uppercase mb-1">Correo Electrónico</label>
        <input type="email" className="w-full bg-white border border-gray-300 p-2 rounded focus:border-mitica-yellow outline-none transition-colors" />
      </div>

      {type === 'event' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
              <label className="block text-xs font-bold uppercase mb-1">Fecha del Evento</label>
              <input type="date" className="w-full bg-white border border-gray-300 p-2 rounded focus:border-mitica-yellow outline-none transition-colors" />
           </div>
           <div>
              <label className="block text-xs font-bold uppercase mb-1">Lugar</label>
              <input type="text" className="w-full bg-white border border-gray-300 p-2 rounded focus:border-mitica-yellow outline-none transition-colors" />
           </div>
           <div className="col-span-full">
             <label className="block text-xs font-bold uppercase mb-1">Cantidad de Personas</label>
             <input type="number" className="w-full bg-white border border-gray-300 p-2 rounded focus:border-mitica-yellow outline-none transition-colors" />
           </div>
        </div>
      )}

      {type === 'job' && (
        <div>
          <label className="block text-xs font-bold uppercase mb-1">Carga tu CV (PDF)</label>
          <input 
            type="file" 
            accept=".pdf"
            className="w-full bg-white border border-gray-300 p-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-mitica-yellow file:text-black hover:file:bg-yellow-400"
          />
        </div>
      )}

      <div className="pt-4">
        <button type="button" className="w-full bg-mitica-yellow text-black font-nexa uppercase py-3 rounded hover:bg-black hover:text-white transition-colors">
          Enviar Solicitud
        </button>
      </div>
    </form>
  );
};

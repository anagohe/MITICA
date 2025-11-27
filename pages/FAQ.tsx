
import React, { useState } from 'react';
import { Title, TitleVariant } from '../components/Typography';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
    { q: '¿Tienen opciones vegetarianas?', a: 'Sí, contamos con nuestra burger "Green Mítica" hecha a base de plantas.' },
    { q: '¿Hacen entregas a domicilio?', a: 'Claro, puedes pedir a través de nuestra App Mítica, UberEats y Rappi.' },
    { q: '¿Puedo facturar mi consumo?', a: 'Sí, puedes solicitar tu factura en el portal de facturación dentro de los 30 días de tu compra.' },
    { q: '¿Son Pet Friendly?', a: 'Nuestras terrazas son 100% Pet Friendly. ¡Trae a tu amigo peludo!' },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full min-h-screen bg-white">
        {/* Hero */}
        <div className="relative h-screen w-full bg-mitica-black overflow-hidden mb-16">
            <img src="https://picsum.photos/1920/1080?faq_hero" className="w-full h-full object-cover opacity-50" alt="FAQ Hero" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Title variant={TitleVariant.REGULAR} text="PREGUNTAS FRECUENTES" className="text-4xl md:text-7xl text-white text-center" />
            </div>
        </div>

        <div className="container mx-auto px-6 max-w-4xl pb-24">
            <div className="space-y-12">
                {FAQS.map((faq, index) => (
                    <div key={index} className="border-l-[6px] border-mitica-yellow pl-8">
                        <button 
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex justify-between items-start text-left group focus:outline-none"
                        >
                            <span className={`font-nexa text-2xl md:text-3xl uppercase leading-tight transition-colors duration-300 ${openIndex === index ? 'text-mitica-yellow' : 'text-black group-hover:text-mitica-yellow'}`}>
                                {faq.q}
                            </span>
                            <span className="text-mitica-yellow ml-4 mt-1">
                                {openIndex === index ? <ChevronUp size={32} /> : <ChevronDown size={32} />}
                            </span>
                        </button>
                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-6 font-rethink text-gray-600 text-justify text-lg leading-relaxed">
                                        {faq.a}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default FAQ;

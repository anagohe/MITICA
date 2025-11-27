
import React, { useState } from 'react';
import { Title, TitleVariant, BodyText } from '../components/Typography';
import { Modal, ContactForm } from '../components/Modals';

const Careers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full">
        {/* Hero */}
        <div className="w-full h-screen relative">
            <img src="https://picsum.photos/1920/1080?team_kitchen" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <Title variant={TitleVariant.TEXTURED_BORDERED} text="BOLSA DE TRABAJO" borderColor="#FFC700" className="text-5xl md:text-8xl text-white" />
            </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 order-2 md:order-1">
                 <div className="pl-6 border-l-4 border-mitica-yellow">
                     <h4 className="font-nexa text-2xl text-mitica-yellow mb-4">¡ÚNETE AL EQUIPO MÍTICA!</h4>
                     <BodyText text="En MÍTICA, buscamos talento para formar parte de nuestra leyenda. Si lo tuyo es el servicio al cliente, te destacas por tu rapidez y precisión, y amas interactuar con la gente, ¡Te necesitamos en nuestro equipo! Únete a nuestra plantilla de trabajo enviando tu CV y datos de contacto." className="text-gray-600 text-sm leading-relaxed text-justify" />
                 </div>
                 
                 <div className="mt-12 text-center md:text-left">
                     <h4 className="font-nexa text-lg mb-4 uppercase">¿TE INTERESA TRABAJAR CON NOSOTROS?</h4>
                     <p className="text-xs text-gray-500 mb-6 font-rethink">Llena nuestro formulario y nos pondremos en contacto contigo lo antes posible.</p>
                     <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-mitica-yellow text-black px-10 py-4 rounded font-nexa uppercase hover:bg-black hover:text-white transition-colors shadow-lg"
                     >
                         ENVÍA TU SOLICITUD
                     </button>
                 </div>
            </div>
            <div className="flex-1 order-1 md:order-2">
                <img src="https://picsum.photos/800/600?chef" className="rounded-lg shadow-2xl border-8 border-white" />
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="ÚNETE AL EQUIPO">
            <ContactForm type="job" />
        </Modal>
    </div>
  );
};

export default Careers;

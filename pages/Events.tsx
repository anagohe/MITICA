import React, { useState } from 'react';
import { Title, TitleVariant, BodyText } from '../components/Typography';
import { Modal, ContactForm } from '../components/Modals';

const Events = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'event' | 'sponsor'>('event');

  const openModal = (type: 'event' | 'sponsor') => {
    setFormType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      {/* Events Section */}
      <section className="mb-0">
        <div className="relative h-screen w-full overflow-hidden">
          <img
            src="https://picsum.photos/1920/1080?party_people"
            className="absolute inset-0 w-full h-full object-cover"
            alt="Eventos Hero"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center px-4">
              <Title
                variant={TitleVariant.REGULAR}
                text="CONVIERTE TUS EVENTOS"
                className="text-4xl md:text-7xl text-white mb-2"
              />
              <Title
                variant={TitleVariant.REGULAR}
                text="EN ALGO LEGENDARIO"
                className="text-3xl md:text-6xl text-mitica-yellow mb-8"
              />
              <BodyText
                text="Convierte tu celebración en un #MomentoLegendario con MÍTICA!"
                className="text-white text-lg mb-4"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-20 text-center max-w-4xl">
          {/* ✅ EVENTOS: negro con borde amarillo */}
          <Title
            variant={TitleVariant.BORDERED}
            text="EVENTOS"
            color="text-[#1D1D1B]"
            borderColor="#F6BA27"
            borderWidth={10}
            className="text-5xl mb-6"
            align="center"
          />

          <p className="font-rethink text-sm md:text-base text-gray-600 mb-12 max-w-2xl mx-auto">
            Llevamos la experiencia y el sabor de nuestras hamburguesas a tu evento con nuestro
            servicio de Foodtruck, disponible en Mérida y San Luis Potosí. Nos encargamos de todo
            para que tú y tus invitados disfruten de nuestro menú.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-12">
            <img
              src="https://picsum.photos/400/300?catering1"
              className="rounded-lg shadow-md hover:scale-105 transition-transform"
              alt="Catering 1"
            />
            <img
              src="https://picsum.photos/400/300?catering2"
              className="rounded-lg shadow-md hover:scale-105 transition-transform"
              alt="Catering 2"
            />
            <img
              src="https://picsum.photos/400/300?catering3"
              className="rounded-lg shadow-md hover:scale-105 transition-transform"
              alt="Catering 3"
            />
          </div>

          <h4 className="font-nexa text-xl mb-4 text-mitica-yellow uppercase">
            ¿Te Interesa Cotizar?
          </h4>
          <p className="text-xs mb-6">
            Llena nuestro formulario y nos pondremos en contacto contigo.
          </p>
          <button
            onClick={() => openModal('event')}
            className="bg-black text-white px-10 py-4 rounded font-nexa uppercase hover:bg-mitica-yellow hover:text-black transition-colors"
          >
            Envía tu Solicitud
          </button>
        </div>
      </section>

      {/* Patrocinios Section (Dark) */}
      <section className="bg-mitica-black text-white py-24 relative overflow-hidden">
        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              {/* ✅ PATROCINIOS: amarillo con textura */}
              <Title
                variant={TitleVariant.TEXTURED}
                text="PATROCINIOS"
                color="text-mitica-yellow"
                className="text-5xl"
                align="left"
              />

              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xl">M</span>
              </div>
            </div>

            <div className="prose prose-invert font-rethink text-sm text-gray-300 mb-8">
              <p>
                En <strong className="text-mitica-yellow">MÍTICA</strong> nos encanta ser parte de
                historias emocionantes. Si estás organizando un evento, tienes un equipo deportivo,
                lideras una iniciativa comunitaria o buscas un partner para cualquier proyecto que
                comparta nuestro espíritu #Legendario, ¡Queremos saber de ti!
              </p>
              <p>Déjanos tus datos de contacto y cuéntanos más sobre tu proyecto en el formulario.</p>
            </div>

            <button
              onClick={() => openModal('sponsor')}
              className="bg-mitica-yellow text-black px-8 py-3 rounded font-nexa hover:bg-white transition-colors uppercase"
            >
              Envía tu Solicitud
            </button>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            <img
              src="https://picsum.photos/400/500?sponsor1"
              className="rounded-xl shadow-2xl w-full h-64 object-cover"
              alt="Sponsor 1"
            />
            <img
              src="https://picsum.photos/400/500?sponsor2"
              className="rounded-xl shadow-2xl w-full h-64 object-cover mt-8"
              alt="Sponsor 2"
            />
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formType === 'event' ? 'TE INTERESA COTIZAR?' : 'PATROCINIOS'}
      >
        <ContactForm type={formType === 'event' ? 'event' : 'job'} />
      </Modal>
    </div>
  );
};

export default Events;

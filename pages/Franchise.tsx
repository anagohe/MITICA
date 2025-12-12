import React from 'react';
import { Title, TitleVariant } from '../components/Typography';

const Franchise = () => {
  return (
    <div className="w-full pb-20 bg-white">
      {/* Hero */}
      <div className="relative h-screen w-full bg-black overflow-hidden mb-20">
        <img
          src="https://picsum.photos/1920/1080?franchise_hero"
          className="w-full h-full object-cover opacity-60"
          alt="Franchise Hero"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Title
              variant={TitleVariant.TEXTURED_BORDERED}
              text="FRANQUICIAS"
              borderColor="#FFF"
              className="text-5xl md:text-8xl text-white mb-2"
            />
            <Title
              variant={TitleVariant.REGULAR}
              text="MÍTICA"
              color="text-mitica-yellow"
              className="text-5xl md:text-8xl"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-3xl">
        {/* Content Article Style */}
        <div className="prose prose-lg font-rethink text-gray-700 mx-auto mb-16">
          {/* ✅ NUEVO TÍTULO ARRIBA DE “ÚNETE A LA LEYENDA” */}
          <div className="text-center mb-12">

            <Title
              variant={TitleVariant.BORDERED}
              text="FRANQUICIAS"
              color="text-white"
              borderColor="#F6BA27"
              borderWidth={10}
              className="text-4xl md:text-5xl"
              align="center"
            />
          </div>

          <p className="lead font-bold text-xl">
            Únete a la leyenda y lleva el sabor de Mítica a tu ciudad. Un modelo de negocio
            probado y exitoso.
          </p>
          <p>
            En octubre de 2024, seguimos expandiéndonos. Mítica ofrece un modelo de negocio rentable
            y escalable. Con nuestro soporte operativo y de marketing, aseguramos que cada sucursal
            mantenga los estándares de calidad que nos caracterizan.
          </p>

          <h3 className="font-nexa text-2xl mt-12 mb-6 uppercase text-black">
            ¿Por qué elegirnos?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-mitica-yellow">
              <h4 className="font-bold mb-2">Retorno de Inversión</h4>
              <p className="text-sm">Atractivos márgenes y recuperación rápida.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-mitica-yellow">
              <h4 className="font-bold mb-2">Soporte 360°</h4>
              <p className="text-sm">Asistencia en operaciones, RH y Marketing.</p>
            </div>
          </div>
          <p>
            Parte de nuestra filosofía es crecer junto a nuestros socios. Buscamos emprendedores
            apasionados por la comida y el servicio.
          </p>
        </div>

        {/* Form Section (Styled distinctly) */}
        <div className="bg-mitica-black text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Texture */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <Title
                variant={TitleVariant.REGULAR}
                text="¿LISTO PARA EMPEZAR?"
                color="text-white"
                className="text-3xl mb-2"
              />
              <p className="font-rethink text-gray-400">
                Completa el formulario y recibe nuestro dossier de franquicia.
              </p>
            </div>

            <form className="space-y-4 font-rethink max-w-md mx-auto">
              <input
                type="text"
                placeholder="Nombre Completo"
                className="w-full p-4 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:border-mitica-yellow outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="Correo Electrónico"
                className="w-full p-4 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:border-mitica-yellow outline-none transition-colors"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Ciudad"
                  className="w-full p-4 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:border-mitica-yellow outline-none transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  className="w-full p-4 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:border-mitica-yellow outline-none transition-colors"
                />
              </div>
              <button className="w-full bg-mitica-yellow text-black font-nexa uppercase py-4 rounded-lg hover:bg-white hover:scale-105 transition-all text-lg shadow-lg mt-4">
                Solicitar Información
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Franchise;

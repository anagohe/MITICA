
import React from 'react';
import { Title, TitleVariant } from '../components/Typography';
import { ShoppingBag, MessageCircle } from 'lucide-react';

const Delivery = () => {
  return (
    <div className="w-full bg-white">
       {/* Full Hero Section */}
       <div className="relative h-screen w-full bg-mitica-yellow overflow-hidden mb-20">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
           <div className="container mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-center relative z-10">
               <div className="text-center md:text-left">
                   <Title variant={TitleVariant.REGULAR} text="DELIVERY" className="text-6xl md:text-9xl text-black mb-2" />
                   <p className="font-rethink text-xl md:text-2xl font-bold uppercase text-black/80">Llevamos la leyenda hasta tu casa</p>
               </div>
               <img src="https://picsum.photos/500/500?bike" className="hidden md:block w-1/3 object-contain ml-12 transform rotate-12 hover:rotate-0 transition-transform" />
           </div>
       </div>

       {/* Top Banner (App Promo) */}
       <div className="container mx-auto px-6 mb-20">
           <div className="bg-black rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden border-4 border-mitica-yellow">
               <div className="relative z-10 md:w-1/2 text-white">
                   <h2 className="font-nexa text-4xl md:text-6xl uppercase leading-none mb-4 text-mitica-yellow">Tu antojo <br/>tiene app</h2>
                   <div className="bg-white text-black inline-block px-4 py-2 rounded-lg mb-2">
                       <span className="font-nexa text-xl">MÍTICA APP</span>
                   </div>
                   <p className="font-rethink font-bold text-lg">Cashback en todas tus compras</p>
                   <p className="font-rethink text-sm mt-2">Delivery & Pick up</p>
               </div>
               <div className="relative z-10 md:w-1/2 flex justify-end mt-8 md:mt-0">
                   <img src="https://picsum.photos/600/400?delivery_banner" className="rounded-xl shadow-lg transform rotate-2 hover:rotate-0 transition-transform border-2 border-white" />
               </div>
           </div>
       </div>

       {/* Main Choice Section */}
       <div className="container mx-auto px-6 mb-20">
          <div className="flex flex-col md:flex-row items-center gap-16">
             <div className="flex-1 order-2 md:order-1 relative">
                 <img src="https://picsum.photos/800/800?box" alt="Delivery Box" className="w-full rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500" />
                 <div className="absolute -top-10 -right-10 font-nexa text-6xl text-gray-200 -z-10">MÍTICA</div>
             </div>
             <div className="flex-1 order-1 md:order-2 text-center md:text-right">
                 <Title variant={TitleVariant.REGULAR} text="¿TE LA LLEVAMOS O" className="text-4xl md:text-5xl leading-none" align="right" />
                 <Title variant={TitleVariant.BORDERED} text="VIENES POR ELLA?" borderColor="#000" className="text-4xl md:text-5xl mb-8 leading-none" align="right" />
                 
                 <div className="flex justify-end mb-8">
                     <div className="w-20 h-1 bg-mitica-yellow"></div>
                 </div>

                 <h3 className="font-nexa text-2xl mb-4 uppercase">TÚ ELIGES</h3>
                 <p className="font-rethink text-gray-600 mb-8 max-w-md ml-auto text-justify" dir="rtl">
                     Descarga nuestra <strong>app</strong> y vive la mejor experiencia. Si prefieres, ya puedes ordenar por WhatsApp.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-6 justify-end">
                     <button className="group flex flex-col items-center justify-center bg-black text-white w-32 h-32 rounded-2xl hover:bg-mitica-yellow hover:text-black transition-all shadow-xl">
                         <div className="bg-gray-800 p-3 rounded-full mb-2 group-hover:bg-white group-hover:text-black transition-colors">
                            <ShoppingBag size={24} />
                         </div>
                         <span className="font-nexa text-[10px] uppercase">PEDIR EN APP</span>
                         <span className="text-[8px] font-rethink mt-1 opacity-70">REWARDS</span>
                     </button>

                     <button className="group flex flex-col items-center justify-center bg-black text-white w-32 h-32 rounded-2xl hover:bg-mitica-yellow hover:text-black transition-all shadow-xl">
                         <div className="bg-gray-800 p-3 rounded-full mb-2 group-hover:bg-white group-hover:text-black transition-colors">
                            <MessageCircle size={24} />
                         </div>
                         <span className="font-nexa text-[10px] uppercase">WHATSAPP</span>
                         <span className="text-[8px] font-rethink mt-1 opacity-70">ORDENA RÁPIDO</span>
                     </button>
                 </div>
             </div>
          </div>
       </div>

       {/* Benefits Icons */}
       <div className="bg-gray-50 py-16">
           <div className="container mx-auto px-6">
               <h3 className="text-center font-nexa text-xl mb-12 uppercase">BENEFICIOS DE DESCARGAR NUESTRA APP</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                   <div className="flex flex-col items-center">
                       <div className="w-16 h-16 bg-mitica-yellow rounded-full flex items-center justify-center text-3xl font-nexa mb-4 shadow-lg">$</div>
                       <h4 className="font-nexa text-sm uppercase mb-2">GANA HASTA 8% <br/>DE CASHBACK</h4>
                   </div>
                   <div className="flex flex-col items-center">
                       <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                           <span className="text-2xl">★</span>
                       </div>
                       <h4 className="font-nexa text-sm uppercase mb-2">CUPONES, PRODUCTOS Y <br/>PROMOCIONES EXCLUSIVAS</h4>
                   </div>
                   <div className="flex flex-col items-center">
                       <div className="w-16 h-16 bg-mitica-yellow rounded-full flex items-center justify-center mb-4 shadow-lg">
                           <img src="https://cdn-icons-png.flaticon.com/512/709/709790.png" className="w-8 opacity-80" alt="Bike" />
                       </div>
                       <h4 className="font-nexa text-sm uppercase mb-2">DELIVERY SIN <br/>COSTO EXTRA</h4>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default Delivery;

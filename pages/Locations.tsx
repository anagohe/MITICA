
import React, { useState } from 'react';
import { Title, TitleVariant } from '../components/Typography';
import { MapPin, Navigation, Phone } from 'lucide-react';
import { Location } from '../types';

const LOCATIONS: Location[] = [
    { id: '1', name: 'MÍTICA MONTEJO', address: 'Av. Paseo de Montejo 456, Centro', lat: 20.9, lng: -89.6, phone: '999 123 4567' },
    { id: '2', name: 'MÍTICA ALTABRISA', address: 'Plaza Altabrisa, Local 45', lat: 21.0, lng: -89.5, phone: '999 987 6543' },
    { id: '3', name: 'MÍTICA CITY CENTER', address: 'City Center, Planta Alta', lat: 21.02, lng: -89.61, phone: '999 111 2222' },
];

const Locations = () => {
  const [selectedLoc, setSelectedLoc] = useState<Location>(LOCATIONS[0]);

  return (
    <div className="w-full pb-20">
        {/* Hero */}
        <div className="relative h-screen w-full bg-black overflow-hidden mb-20">
            <img src="https://picsum.photos/1920/1080?storefront" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <img src="https://via.placeholder.com/300x100/ffff00/000000?text=MITICA+LOGO" className="h-24 mx-auto mb-8 opacity-90 mix-blend-screen invert" alt="Logo" />
                    <div className="bg-black text-mitica-yellow inline-block px-12 py-4 transform -rotate-1 shadow-2xl">
                        <Title variant={TitleVariant.REGULAR} text="UBICACIONES" color="text-mitica-yellow" className="text-4xl md:text-6xl" />
                    </div>
                </div>
            </div>
        </div>

        {/* Interactive Map Section */}
        <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                
                {/* Sidebar List */}
                <div className="w-full lg:w-1/3 flex flex-col bg-gray-50 border-r border-gray-200">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre de sucursal..." 
                            className="w-full p-4 rounded-lg border border-gray-300 font-rethink text-sm focus:border-mitica-yellow outline-none bg-gray-50" 
                        />
                        <div className="flex gap-2 mt-4">
                            <button className="text-xs bg-gray-200 px-3 py-1 rounded-full hover:bg-mitica-yellow transition-colors">Más Cerca</button>
                            <button className="text-xs bg-gray-200 px-3 py-1 rounded-full hover:bg-mitica-yellow transition-colors">Solicitados</button>
                        </div>
                    </div>
                    
                    <div className="overflow-y-auto flex-grow p-4 space-y-4">
                        {LOCATIONS.map(loc => (
                            <div 
                                key={loc.id} 
                                onClick={() => setSelectedLoc(loc)}
                                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 border ${selectedLoc.id === loc.id ? 'bg-mitica-yellow border-mitica-yellow shadow-md' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                            >
                                <h4 className={`font-nexa text-lg mb-1 ${selectedLoc.id === loc.id ? 'text-black' : 'text-gray-800'}`}>{loc.name}</h4>
                                <p className={`text-xs font-rethink mb-3 ${selectedLoc.id === loc.id ? 'text-black/70' : 'text-gray-500'}`}>{loc.address}</p>
                                <div className="flex items-center gap-4">
                                     <div className="flex items-center gap-1 text-xs font-bold font-rethink">
                                         <Phone size={12} /> {loc.phone}
                                     </div>
                                     {selectedLoc.id === loc.id && (
                                         <span className="text-[10px] bg-black text-white px-2 py-1 rounded uppercase ml-auto">Seleccionado</span>
                                     )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Map Visual */}
                <div className="w-full lg:w-2/3 relative bg-gray-200">
                     {/* Map Background */}
                     <div className="absolute inset-0 bg-[url('https://mt1.google.com/vt/lyrs=m&x=1325&y=3143&z=13')] bg-cover opacity-70 grayscale hover:grayscale-0 transition-all duration-1000"></div>
                     
                     {/* Pins */}
                     {LOCATIONS.map(loc => (
                         <div 
                            key={loc.id}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 hover:z-50 ${loc.id === selectedLoc.id ? 'scale-125 z-50' : 'z-10'}`}
                            style={{ 
                                top: `${50 + (loc.lat - 21.0) * 100}%`, // Mock positioning
                                left: `${50 + (loc.lng + 89.6) * 100}%` 
                            }}
                            onClick={() => setSelectedLoc(loc)}
                         >
                             <MapPin size={48} className={`${loc.id === selectedLoc.id ? 'text-mitica-yellow fill-black' : 'text-black fill-white'} drop-shadow-xl`} />
                         </div>
                     ))}

                     {/* Selected Info Float */}
                     <div className="absolute bottom-8 left-8 bg-white p-6 rounded-xl shadow-2xl max-w-sm z-40 animate-in fade-in slide-in-from-bottom-4">
                         <h3 className="font-nexa text-xl mb-2">{selectedLoc.name}</h3>
                         <p className="font-rethink text-sm text-gray-600 mb-4">{selectedLoc.address}</p>
                         <button className="w-full bg-black text-white py-3 rounded font-nexa uppercase text-xs hover:bg-mitica-yellow hover:text-black transition-colors flex items-center justify-center gap-2">
                             <Navigation size={14} /> Cómo llegar
                         </button>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Locations;

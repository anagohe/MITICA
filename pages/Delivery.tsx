import React, { useEffect, useState } from 'react';
import { Title, TitleVariant } from '../components/Typography';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { client } from '../sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// ==== Sanity image builder ====
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).url();
}

// ==== Helper: encontrar primera imagen dentro de hero ====
function findFirstImage(obj: any): any | null {
  if (!obj || typeof obj !== 'object') return null;

  if (obj._type === 'image' && obj.asset?._ref) return obj;
  if (obj.asset?.ref || obj.asset?._ref) return obj;

  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      const found = findFirstImage(value);
      if (found) return found;
    }
  }
  return null;
}

// ==== Tipo de deliveryPage en Sanity ====
type Benefit = {
  title?: string;
  icon?: any;
};

type DeliveryPageSanity = {
  hero?: any;
  appBannerImage?: any;
  choiceImage?: any;
  benefits?: Benefit[];
};

const DELIVERY_QUERY = `
*[_type == "deliveryPage"][0]{
  hero,
  appBannerImage,
  choiceImage,
  benefits[]{title, icon}
}
`;

const Delivery = () => {
  const [data, setData] = useState<DeliveryPageSanity | null>(null);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const result = await client.fetch<DeliveryPageSanity>(DELIVERY_QUERY);
        console.log('SANITY deliveryPage:', result);
        setData(result);
      } catch (err) {
        console.error('Error fetching deliveryPage from Sanity', err);
      }
    };

    fetchDelivery();
  }, []);

  // ==== URLs con fallback ====
  const heroImageObj = data?.hero ? findFirstImage(data.hero) : null;
  const heroImageUrl = heroImageObj
    ? urlFor(heroImageObj)
    : 'https://picsum.photos/1200/700?hero_fallback';

  const appBannerImageUrl = data?.appBannerImage
    ? urlFor(data.appBannerImage)
    : heroImageUrl; // si no hay appBannerImage, usamos hero

  const choiceImageUrl = data?.choiceImage
    ? urlFor(data.choiceImage)
    : 'https://picsum.photos/800/800?box';

  const benefitsFromSanity = data?.benefits && data.benefits.length > 0;

  // Banner superior (amarillo) -> solo imagen completa
  const topBannerUrl = appBannerImageUrl;

  return (
    <div className="w-full bg-white">
      {/* BANNER AMARILLO SUPERIOR (solo imagen, mismo alto que About) */}
      <div className="relative h-screen w-full overflow-hidden mb-12">
        <img
          src={topBannerUrl}
          alt="Tu antojo tiene app"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Sección blanca: ¿TE LA LLEVAMOS O VIENES POR ELLA? */}
      <div className="container mx-auto px-6 mb-20">
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* TEXTO — alineado a la izquierda, bloque un poco más a la derecha */}
          <div className="flex-1 order-1 md:order-1 text-center md:text-left md:pl-16 lg:pl-24">
            <Title
              variant={TitleVariant.REGULAR}
              text="¿TE LA LLEVAMOS O"
              className="text-3xl md:text-4xl lg:text-5xl leading-none"
              align="left"
            />
            <Title
              variant={TitleVariant.BORDERED}
              text="VIENES POR ELLA?"
              borderColor="#000"
              className="text-3xl md:text-4xl lg:text-5xl mb-6 leading-none"
              align="left"
            />

            <h3 className="font-nexa text-xl md:text-2xl mb-3 uppercase">
              TÚ ELIGES
            </h3>
            <p className="font-rethink text-gray-600 mb-6 max-w-md text-left">
              Descarga nuestra App y vive la mejor experiencia.
              Si prefieres, ya puedes ordenar por WhatsApp.
            </p>

            <div className="flex flex-row gap-6 mt-4">
              <button className="group flex flex-col items-center justify-center bg-black text-white w-24 h-24 md:w-28 md:h-28 rounded-2xl hover:bg-mitica-yellow hover:text-black transition-all shadow-xl">
                <div className="bg-gray-800 p-3 rounded-full mb-2 group-hover:bg-white group-hover:text-black transition-colors">
                  <ShoppingBag size={22} />
                </div>
                <span className="font-nexa text-[9px] md:text-[10px] uppercase">
                  PEDIR EN APP
                </span>
              </button>

              <button className="group flex flex-col items-center justify-center bg-black text-white w-24 h-24 md:w-28 md:h-28 rounded-2xl hover:bg-mitica-yellow hover:text-black transition-all shadow-xl">
                <div className="bg-gray-800 p-3 rounded-full mb-2 group-hover:bg-white group-hover:text-black transition-colors">
                  <MessageCircle size={22} />
                </div>
                <span className="font-nexa text-[9px] md:text-[10px] uppercase">
                  WHATSAPP
                </span>
              </button>
            </div>
          </div>

          {/* IMAGEN CAJA DELIVERY — derecha, vertical, un poco más grande y animada */}
          <div className="flex-1 order-2 md:order-2 relative flex justify-center md:justify-end">
            <div className="w-40 md:w-48 lg:w-56">
              <img
                src={choiceImageUrl}
                alt="Delivery Box"
                className="w-full aspect-[9/16] object-cover rounded-3xl shadow-2xl transform origin-bottom hover:translate-x-2 hover:rotate-2 active:translate-x-2 transition-transform duration-500"
              />
            </div>
            <div className="absolute -top-10 -right-4 md:-right-6 font-nexa text-4xl md:text-5xl text-gray-200 -z-10">
              MÍTICA
            </div>
          </div>
        </div>
      </div>

      {/* BENEFICIOS – conectados a Sanity (benefits[]) */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-center font-nexa text-xl mb-12 uppercase">
            BENEFICIOS DE DESCARGAR NUESTRA APP
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {benefitsFromSanity
              ? data!.benefits!.map((benefit, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-mitica-yellow rounded-full flex items-center justify-center mb-4 shadow-lg overflow-hidden">
                      {benefit.icon ? (
                        <img
                          src={urlFor(benefit.icon)}
                          alt={benefit.title || `Beneficio ${idx + 1}`}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <span className="font-nexa text-2xl">★</span>
                      )}
                    </div>
                    <h4 className="font-nexa text-sm uppercase mb-2">
                      {benefit.title
                        ? benefit.title.split('\n').map((line, i, arr) => (
                            <span key={i}>
                              {line}
                              {i < arr.length - 1 && <br />}
                            </span>
                          ))
                        : `Beneficio ${idx + 1}`}
                    </h4>
                  </div>
                ))
              : (
                <>
                  {/* Fallback si aún no llenas benefits en Sanity */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-mitica-yellow rounded-full flex items-center justify-center text-3xl font-nexa mb-4 shadow-lg">
                      $
                    </div>
                    <h4 className="font-nexa text-sm uppercase mb-2">
                      GANA HASTA 8% <br />DE CASHBACK
                    </h4>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <span className="text-2xl">★</span>
                    </div>
                    <h4 className="font-nexa text-sm uppercase mb-2">
                      CUPONES, PRODUCTOS Y <br />PROMOCIONES EXCLUSIVAS
                    </h4>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-mitica-yellow rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/709/709790.png"
                        className="w-8 opacity-80"
                        alt="Bike"
                      />
                    </div>
                    <h4 className="font-nexa text-sm uppercase mb-2">
                      DELIVERY SIN <br />COSTO EXTRA
                    </h4>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;

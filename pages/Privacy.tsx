// pages/Privacy.tsx
import React from 'react';
import { Title, TitleVariant, BodyText } from '../components/Typography';

const Privacy = () => {
  return (
    <section className="bg-white pt-24 md:pt-28">      <div className="container mx-auto px-6 md:px-10 py-16 md:py-20 max-w-4xl">
        <Title
          variant={TitleVariant.TEXTURED}
          text="Aviso de Privacidad Integral"
          color="text-mitica-black"
          align="left"
          className="text-2xl md:text-3xl"
        />

        <p className="mt-3 text-sm text-gray-500 font-rethink">
          Última actualización: 23/02/2026
        </p>

        <div className="mt-10 space-y-10 text-mitica-black">
          <BodyText
            text="MÍTICA BURGERS, con domicilio en Calle 27 #86, Colonia Chichén-Itzá, Mérida, Yucatán, México (en adelante, “MÍTICA BURGERS”), es responsable del tratamiento de los datos personales de sus clientes y usuarios, de conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, su Reglamento y demás disposiciones aplicables."
            className="text-gray-700 leading-relaxed"
            align="left"
          />

          {/* 1 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              1) Datos personales que recabamos
            </h2>

            <BodyText
              text="Para cumplir con las finalidades descritas en el presente Aviso de Privacidad, MÍTICA BURGERS podrá recabar datos personales a través de nuestra aplicación móvil, sitio web, call center y/o chatbot, según corresponda."
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-nexa text-lg uppercase tracking-wide text-mitica-black">
                  A) Usuarios de la app
                </h3>

                <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
                  <li>
                    <span className="font-bold text-gray-900">
                      Identificación y contacto:
                    </span>{' '}
                    nombre completo, número de teléfono, correo electrónico.
                  </li>
                  <li>
                    <span className="font-bold text-gray-900">Domicilio:</span>{' '}
                    entidad federativa, municipio y código postal.
                  </li>
                  <li>
                    <span className="font-bold text-gray-900">
                      Datos de transacción:
                    </span>{' '}
                    información relacionada con sus pedidos (por ejemplo, detalles del
                    pedido y monto cobrado).
                  </li>
                  <li>
                    <span className="font-bold text-gray-900">
                      Datos sobre el uso de la plataforma:
                    </span>{' '}
                    información sobre cómo interactúa con nuestros servicios (por ejemplo,
                    secciones consultadas o acciones dentro de la app).
                  </li>
                  <li>
                    <span className="font-bold text-gray-900">Ubicación:</span>{' '}
                    MÍTICA BURGERS no recaba su ubicación de manera automática. En caso de
                    que alguna funcionalidad de la app llegue a solicitar acceso a ubicación,
                    ésta se recabará únicamente si el usuario lo autoriza desde su dispositivo
                    y se informará en el momento correspondiente.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-nexa text-lg uppercase tracking-wide text-mitica-black">
                  B) Usuarios del sitio web
                </h3>

                <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
                  <li>Nombre completo</li>
                  <li>Número de teléfono</li>
                  <li>Correo electrónico</li>
                  <li>
                    (En su caso) nombre de usuario o dato de perfil vinculado a redes sociales
                    solo si usted lo proporciona voluntariamente mediante algún formulario o
                    interacción.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-nexa text-lg uppercase tracking-wide text-mitica-black">
                  C) A través del call center / chatbot
                </h3>

                <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
                  <li>Nombre completo</li>
                  <li>Número de teléfono</li>
                  <li>Correo electrónico</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              2) Finalidades del tratamiento
            </h2>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-nexa text-lg uppercase tracking-wide text-mitica-black">
                  A) Finalidades primarias (necesarias)
                </h3>

                <BodyText
                  text="Los datos personales recabados serán utilizados para:"
                  className="mt-3 text-gray-700 leading-relaxed"
                  align="left"
                />

                <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
                  <li>Identificar a los usuarios.</li>
                  <li>Crear y administrar cuentas (cuando aplique).</li>
                  <li>Operar y administrar nuestra app y/o sitio web.</li>
                  <li>Proporcionar y administrar los productos y servicios solicitados.</li>
                  <li>Gestionar pedidos y, cuando aplique, la entrega a domicilio.</li>
                  <li>
                    Atender preguntas, comentarios, quejas, sugerencias y/o solicitudes de
                    información.
                  </li>
                  <li>Comunicarnos con usted respecto de sus pedidos, servicios o atención.</li>
                  <li>Evaluar la calidad de nuestros servicios.</li>
                  <li>
                    Realizar la facturación electrónica correspondiente cuando el usuario la
                    solicite y proporcione los datos necesarios.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-nexa text-lg uppercase tracking-wide text-mitica-black">
                  B) Finalidades secundarias (opcionales)
                </h3>

                <BodyText
                  text="De manera adicional, y si usted no se opone, MÍTICA BURGERS podrá tratar algunos datos personales para:"
                  className="mt-3 text-gray-700 leading-relaxed"
                  align="left"
                />

                <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
                  <li>Enviarle publicidad, promociones y ofertas.</li>
                  <li>
                    Realizar análisis para comprender preferencias y mejorar productos, servicios
                    y atención al cliente.
                  </li>
                </ul>

                <p className="mt-4 text-gray-700 font-rethink leading-relaxed">
                  Si no desea que sus datos personales se utilicen para estas finalidades
                  secundarias, puede manifestarlo enviando un correo a:{' '}
                  <a
                    href="mailto:marketing@miticaburgers.com?subject=Oposición%20a%20finalidades%20secundarias"
                    className="font-bold underline hover:text-mitica-yellow transition-colors"
                  >
                    marketing@miticaburgers.com
                  </a>{' '}
                  (asunto: “Oposición a finalidades secundarias”).
                </p>
              </div>
            </div>
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              3) Medidas de seguridad
            </h2>

            <BodyText
              text="MÍTICA BURGERS resguarda los datos personales bajo medidas de seguridad administrativas, físicas y técnicas razonables, con el objeto de protegerlos contra daño, pérdida, alteración, destrucción, uso, acceso o tratamiento no autorizado."
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              4) Uso de plataformas y proveedores (encargados)
            </h2>

            <BodyText
              text="Para operar nuestro sitio web y administrar contenido, MÍTICA BURGERS utiliza servicios de terceros que pueden tratar datos personales únicamente como proveedores y bajo nuestras instrucciones, tales como:"
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />

            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <li>Vercel (servicio de hosting/infraestructura del sitio web).</li>
              <li>Sanity (plataforma de administración de contenido).</li>
            </ul>

            <BodyText
              text="Estos proveedores actúan como encargados, por lo que no podrán usar la información para fines distintos a la prestación del servicio contratado."
              className="mt-4 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              5) Mapa del sitio web (sin geolocalización)
            </h2>

            <BodyText
              text="El sitio web puede mostrar un mapa con fines informativos (por ejemplo, para ubicar sucursales). Dicho mapa no utiliza la ubicación actual del usuario ni solicita permisos de geolocalización."
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              6) Transferencias de datos personales
            </h2>

            <BodyText
              text="MÍTICA BURGERS no transfiere sus datos personales a terceros ajenos, salvo en los casos legalmente previstos, por requerimiento de autoridad competente o cuando sea necesario para cumplir obligaciones legales aplicables."
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 7 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              7) Derechos ARCO y revocación del consentimiento
            </h2>

            <p className="mt-3 text-gray-700 font-rethink leading-relaxed">
              Usted (o su representante legal) puede ejercer sus derechos de Acceso,
              Rectificación, Cancelación u Oposición (ARCO), así como revocar el
              consentimiento para el tratamiento de sus datos o limitar su uso o divulgación,
              enviando una solicitud al correo:{' '}
              <a
                href="mailto:marketing@miticaburgers.com"
                className="font-bold underline hover:text-mitica-yellow transition-colors"
              >
                marketing@miticaburgers.com
              </a>
              .
            </p>

            <BodyText
              text="Para poder atender su solicitud, deberá incluir:"
              className="mt-4 text-gray-700 leading-relaxed"
              align="left"
            />

            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <li>Nombre del titular y medio para comunicar la respuesta.</li>
              <li>Descripción clara del derecho que desea ejercer y los datos relacionados.</li>
              <li>
                Copia de una identificación oficial del titular (y, en su caso, documento que
                acredite la representación legal).
              </li>
              <li>Cualquier información adicional que facilite la localización de los datos.</li>
            </ul>
          </div>

          {/* 8 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              8) Conservación de los datos
            </h2>

            <BodyText
              text="MÍTICA BURGERS conservará los datos personales únicamente durante el tiempo necesario para cumplir con las finalidades descritas en este Aviso de Privacidad y los plazos exigidos por la legislación aplicable. Una vez que ya no exista una finalidad o una obligación legal de conservación, los datos serán eliminados o anonimizados conforme corresponda."
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 9 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              9) Cambios al Aviso de Privacidad
            </h2>

            <BodyText
              text="El presente Aviso de Privacidad puede modificarse para cumplir requerimientos legales o por necesidades operativas. La versión actualizada estará disponible en el sitio web oficial de MÍTICA BURGERS."
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
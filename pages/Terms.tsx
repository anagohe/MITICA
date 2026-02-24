// pages/Terms.tsx
import React from 'react';
import { Title, TitleVariant, BodyText } from '../components/Typography';

const Terms = () => {
  return (
    <section className="bg-white pt-24 md:pt-28">      <div className="container mx-auto px-6 md:px-10 py-16 md:py-20 max-w-4xl">
        <Title
          variant={TitleVariant.TEXTURED}
          text="Términos y Condiciones de Uso"
          color="text-mitica-black"
          align="left"
          className="text-2xl md:text-3xl"
        />

        <p className="mt-3 text-sm text-gray-500 font-rethink">
          Última actualización: 23/02/2026
        </p>

        <div className="mt-10 space-y-10 text-mitica-black">
          <BodyText
            text='Estos Términos y Condiciones (“Términos”) regulan el acceso y uso del sitio web de MÍTICA BURGERS (el “Sitio”), incluyendo sus secciones informativas y formularios de contacto. Al navegar o utilizar el Sitio, usted acepta estos Términos. Si no está de acuerdo, por favor no utilice el Sitio.'
            className="text-gray-700 leading-relaxed"
            align="left"
          />

          {/* 1 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              1) Identidad del responsable
            </h2>

            <div className="mt-3 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <p>
                <span className="font-bold text-gray-900">MÍTICA BURGERS</span>
              </p>
              <p>Domicilio: Calle 27 #86, Col. Chichén-Itzá, Mérida, Yucatán, México.</p>
              <p>
                Contacto:{' '}
                <a
                  href="mailto:marketing@miticaburgers.com"
                  className="font-bold underline hover:text-mitica-yellow transition-colors"
                >
                  marketing@miticaburgers.com
                </a>
              </p>
            </div>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              2) Uso permitido del Sitio
            </h2>

            <BodyText
              text="Usted se compromete a usar el Sitio de forma lícita y conforme a estos Términos. En particular, se obliga a:"
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />

            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <li>No usar el Sitio para fines fraudulentos o ilícitos.</li>
              <li>No intentar acceder sin autorización a sistemas, bases de datos o cuentas.</li>
              <li>No introducir código malicioso (virus, bots, intentos de explotación, etc.).</li>
              <li>No interferir con el funcionamiento del Sitio ni intentar vulnerar su seguridad.</li>
            </ul>

            <BodyText
              text="MÍTICA BURGERS puede restringir o bloquear el acceso cuando detecte uso indebido o actividad sospechosa."
              className="mt-4 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              3) Contenido e información del Sitio
            </h2>

            <BodyText
              text="El Sitio puede incluir información sobre productos, ingredientes, disponibilidad, precios, promociones, sucursales, horarios, delivery y pickup. Aunque procuramos que la información sea precisa y esté actualizada, puede haber errores tipográficos, cambios operativos o variaciones por sucursal. MÍTICA BURGERS se reserva el derecho de modificar, actualizar o eliminar contenido del Sitio en cualquier momento, sin previo aviso."
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              4) Menú, precios, promociones y disponibilidad
            </h2>

            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <li>
                Los precios, productos y promociones pueden variar por sucursal, zona, horario o
                canal (por ejemplo, app, call center o plataformas de terceros).
              </li>
              <li>
                Las imágenes del Sitio son ilustrativas. El producto final puede variar por
                disponibilidad de insumos o ajustes operativos.
              </li>
              <li>
                Las promociones pueden estar sujetas a vigencia, disponibilidad y condiciones
                específicas.
              </li>
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              5) Pedidos, delivery y pickup (si aplica)
            </h2>

            <BodyText
              text="El Sitio puede incluir información para facilitar pedidos por otros canales (por ejemplo, app, call center o enlaces a terceros). En esos casos:"
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />

            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <li>
                Los tiempos de preparación y entrega son estimados y pueden variar por demanda,
                clima, tráfico o causas externas.
              </li>
              <li>
                Pueden existir zonas de cobertura, horarios y/o condiciones operativas definidas
                por cada sucursal o canal.
              </li>
              <li>
                MÍTICA BURGERS podrá rechazar o cancelar solicitudes cuando no sea posible
                cumplirlas por causas operativas, disponibilidad, seguridad o información
                insuficiente.
              </li>
            </ul>
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              6) Formularios y contacto
            </h2>

            <BodyText
              text="Si usted proporciona información mediante formularios (por ejemplo, comentarios, quejas o solicitudes), acepta:"
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />

            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <li>Proporcionar información veraz y actual.</li>
              <li>No enviar contenido ofensivo, discriminatorio, ilegal o que infrinja derechos de terceros.</li>
            </ul>

            <BodyText
              text="MÍTICA BURGERS podrá no dar trámite a mensajes que incumplan lo anterior."
              className="mt-4 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 7 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              7) Propiedad intelectual
            </h2>

            <BodyText
              text="Todo el contenido del Sitio (marcas, logotipos, textos, fotografías, diseño, código, y demás elementos) es propiedad de MÍTICA BURGERS o se utiliza con autorización, y está protegido por leyes de propiedad intelectual."
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />

            <BodyText
              text="Queda prohibida su reproducción, distribución o explotación sin autorización previa y por escrito de MÍTICA BURGERS, salvo para uso personal y no comercial."
              className="mt-4 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 8 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              8) Enlaces a terceros
            </h2>

            <BodyText
              text="El Sitio puede contener enlaces a sitios o servicios de terceros (por ejemplo, redes sociales, mapas o plataformas externas). MÍTICA BURGERS no controla ni es responsable del contenido, políticas o prácticas de dichos terceros. El acceso a ellos es bajo su propio riesgo."
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 9 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              9) Disponibilidad del Sitio y limitación de responsabilidad
            </h2>

            <BodyText
              text='El Sitio se ofrece “tal cual” y “según disponibilidad”. En la medida permitida por la ley, MÍTICA BURGERS no será responsable por:'
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />

            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <li>Interrupciones del Sitio por mantenimiento, fallas técnicas o causas fuera de control.</li>
              <li>Daños derivados del uso indebido del Sitio por parte del usuario.</li>
              <li>Variaciones razonables en productos, precios, disponibilidad o tiempos estimados.</li>
              <li>Contenido o servicios de terceros enlazados desde el Sitio.</li>
            </ul>
          </div>

          {/* 10 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              10) Privacidad
            </h2>

            <BodyText
              text="El tratamiento de datos personales se rige por el Aviso de Privacidad de MÍTICA BURGERS, disponible en el Sitio. Al usar el Sitio, usted reconoce haberlo leído y entendido."
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 11 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              11) Modificaciones a los Términos
            </h2>

            <BodyText
              text="MÍTICA BURGERS podrá actualizar estos Términos en cualquier momento. La versión vigente será la publicada en el Sitio con su fecha de última actualización. El uso continuado del Sitio implica la aceptación de los cambios."
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 12 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              12) Legislación aplicable y jurisdicción
            </h2>

            <BodyText
              text="Estos Términos se rigen por las leyes aplicables de los Estados Unidos Mexicanos. Para cualquier controversia, las partes se someten a la jurisdicción de los tribunales competentes de Mérida, Yucatán, renunciando a cualquier otro fuero que pudiera corresponderles."
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terms;
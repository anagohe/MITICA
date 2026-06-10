// src/pages/Terms.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Title, TitleVariant, BodyText } from '../components/Typography'
import { useSiteLanguage } from '../i18n'

const Terms = () => {
  const { isEnglish, localizedPath } = useSiteLanguage()

  return (
    <section className="bg-white pt-24 md:pt-28">
      <div className="container mx-auto px-6 md:px-10 py-16 md:py-20 max-w-4xl">
        <Title
          variant={TitleVariant.TEXTURED}
          text={isEnglish ? 'Terms and Conditions of Use' : 'Términos y Condiciones de Uso'}
          color="text-mitica-black"
          align="left"
          className="text-2xl md:text-3xl"
        />

        <p className="mt-3 text-sm text-gray-500 font-rethink">
          {isEnglish ? 'Last updated: 02/23/2026' : 'Última actualización: 23/02/2026'}
        </p>

        <div className="mt-10 space-y-10 text-mitica-black">
          <BodyText
            text={
              isEnglish
                ? 'These Terms and Conditions (“Terms”) govern access to and use of the MÍTICA BURGERS website (the “Site”), including its informational sections and contact forms. By browsing or using the Site, you accept these Terms. If you do not agree, please do not use the Site.'
                : 'Estos Términos y Condiciones (“Términos”) regulan el acceso y uso del sitio web de MÍTICA BURGERS (el “Sitio”), incluyendo sus secciones informativas y formularios de contacto. Al navegar o utilizar el Sitio, usted acepta estos Términos. Si no está de acuerdo, por favor no utilice el Sitio.'
            }
            className="text-gray-700 leading-relaxed"
            align="left"
          />

          {/* 1 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '1) Responsible party identity' : '1) Identidad del responsable'}
            </h2>

            <div className="mt-3 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <p>
                <span className="font-bold text-gray-900">MÍTICA BURGERS</span>
              </p>
              <p>
                {isEnglish
                  ? 'Address: Calle 27 #86, Col. Chichén-Itzá, Mérida, Yucatán, Mexico.'
                  : 'Domicilio: Calle 27 #86, Col. Chichén-Itzá, Mérida, Yucatán, México.'}
              </p>
              <p>
                {isEnglish ? 'Contact: ' : 'Contacto: '}
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
              {isEnglish ? '2) Permitted use of the Site' : '2) Uso permitido del Sitio'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'You agree to use the Site lawfully and in accordance with these Terms. In particular, you agree to:'
                  : 'Usted se compromete a usar el Sitio de forma lícita y conforme a estos Términos. En particular, se obliga a:'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />

            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <li>{isEnglish ? 'Not use the Site for fraudulent or illegal purposes.' : 'No usar el Sitio para fines fraudulentos o ilícitos.'}</li>
              <li>{isEnglish ? 'Not attempt to access systems, databases, or accounts without authorization.' : 'No intentar acceder sin autorización a sistemas, bases de datos o cuentas.'}</li>
              <li>{isEnglish ? 'Not introduce malicious code, such as viruses, bots, or exploitation attempts.' : 'No introducir código malicioso (virus, bots, intentos de explotación, etc.).'}</li>
              <li>{isEnglish ? 'Not interfere with the operation of the Site or attempt to compromise its security.' : 'No interferir con el funcionamiento del Sitio ni intentar vulnerar su seguridad.'}</li>
            </ul>

            <BodyText
              text={
                isEnglish
                  ? 'MÍTICA BURGERS may restrict or block access when misuse or suspicious activity is detected.'
                  : 'MÍTICA BURGERS puede restringir o bloquear el acceso cuando detecte uso indebido o actividad sospechosa.'
              }
              className="mt-4 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '3) Site content and information' : '3) Contenido e información del Sitio'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'The Site may include information about products, ingredients, availability, prices, promotions, branches, schedules, delivery, and pickup. Although we strive to keep the information accurate and updated, there may be typographical errors, operational changes, or variations by branch. MÍTICA BURGERS reserves the right to modify, update, or remove content from the Site at any time without prior notice.'
                  : 'El Sitio puede incluir información sobre productos, ingredientes, disponibilidad, precios, promociones, sucursales, horarios, delivery y pickup. Aunque procuramos que la información sea precisa y esté actualizada, puede haber errores tipográficos, cambios operativos o variaciones por sucursal. MÍTICA BURGERS se reserva el derecho de modificar, actualizar o eliminar contenido del Sitio en cualquier momento, sin previo aviso.'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '4) Menu, prices, promotions, and availability' : '4) Menú, precios, promociones y disponibilidad'}
            </h2>

            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <li>
                {isEnglish
                  ? 'Prices, products, and promotions may vary by branch, area, schedule, or channel, such as app, call center, or third-party platforms.'
                  : 'Los precios, productos y promociones pueden variar por sucursal, zona, horario o canal (por ejemplo, app, call center o plataformas de terceros).'}
              </li>
              <li>
                {isEnglish
                  ? 'Images on the Site are for illustrative purposes. The final product may vary due to ingredient availability or operational adjustments.'
                  : 'Las imágenes del Sitio son ilustrativas. El producto final puede variar por disponibilidad de insumos o ajustes operativos.'}
              </li>
              <li>
                {isEnglish
                  ? 'Promotions may be subject to validity period, availability, and specific conditions.'
                  : 'Las promociones pueden estar sujetas a vigencia, disponibilidad y condiciones específicas.'}
              </li>
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '5) Orders, delivery, and pickup' : '5) Pedidos, delivery y pickup (si aplica)'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'The Site may include information to facilitate orders through other channels, such as the app, call center, or third-party links. In these cases:'
                  : 'El Sitio puede incluir información para facilitar pedidos por otros canales (por ejemplo, app, call center o enlaces a terceros). En esos casos:'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />

            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <li>
                {isEnglish
                  ? 'Preparation and delivery times are estimates and may vary due to demand, weather, traffic, or external causes.'
                  : 'Los tiempos de preparación y entrega son estimados y pueden variar por demanda, clima, tráfico o causas externas.'}
              </li>
              <li>
                {isEnglish
                  ? 'Coverage areas, schedules, and/or operating conditions may be defined by each branch or channel.'
                  : 'Pueden existir zonas de cobertura, horarios y/o condiciones operativas definidas por cada sucursal o canal.'}
              </li>
              <li>
                {isEnglish
                  ? 'MÍTICA BURGERS may reject or cancel requests when it is not possible to fulfill them due to operational causes, availability, safety, or insufficient information.'
                  : 'MÍTICA BURGERS podrá rechazar o cancelar solicitudes cuando no sea posible cumplirlas por causas operativas, disponibilidad, seguridad o información insuficiente.'}
              </li>
            </ul>
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '6) Forms and contact' : '6) Formularios y contacto'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'If you provide information through forms, such as comments, complaints, or requests, you agree to:'
                  : 'Si usted proporciona información mediante formularios (por ejemplo, comentarios, quejas o solicitudes), acepta:'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />

            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <li>{isEnglish ? 'Provide truthful and current information.' : 'Proporcionar información veraz y actual.'}</li>
              <li>{isEnglish ? 'Not send offensive, discriminatory, illegal content, or content that infringes third-party rights.' : 'No enviar contenido ofensivo, discriminatorio, ilegal o que infrinja derechos de terceros.'}</li>
            </ul>

            <BodyText
              text={
                isEnglish
                  ? 'MÍTICA BURGERS may choose not to process messages that fail to comply with the above.'
                  : 'MÍTICA BURGERS podrá no dar trámite a mensajes que incumplan lo anterior.'
              }
              className="mt-4 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 7 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '7) Intellectual property' : '7) Propiedad intelectual'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'All Site content, including trademarks, logos, texts, photographs, design, code, and other elements, is owned by MÍTICA BURGERS or used with authorization, and is protected by intellectual property laws.'
                  : 'Todo el contenido del Sitio (marcas, logotipos, textos, fotografías, diseño, código, y demás elementos) es propiedad de MÍTICA BURGERS o se utiliza con autorización, y está protegido por leyes de propiedad intelectual.'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />

            <BodyText
              text={
                isEnglish
                  ? 'Reproduction, distribution, or exploitation without prior written authorization from MÍTICA BURGERS is prohibited, except for personal and non-commercial use.'
                  : 'Queda prohibida su reproducción, distribución o explotación sin autorización previa y por escrito de MÍTICA BURGERS, salvo para uso personal y no comercial.'
              }
              className="mt-4 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 8 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '8) Third-party links' : '8) Enlaces a terceros'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'The Site may contain links to third-party websites or services, such as social media, maps, or external platforms. MÍTICA BURGERS does not control and is not responsible for the content, policies, or practices of such third parties. Access to them is at your own risk.'
                  : 'El Sitio puede contener enlaces a sitios o servicios de terceros (por ejemplo, redes sociales, mapas o plataformas externas). MÍTICA BURGERS no controla ni es responsable del contenido, políticas o prácticas de dichos terceros. El acceso a ellos es bajo su propio riesgo.'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 9 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '9) Site availability and limitation of liability' : '9) Disponibilidad del Sitio y limitación de responsabilidad'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'The Site is provided “as is” and “as available.” To the extent permitted by law, MÍTICA BURGERS will not be liable for:'
                  : 'El Sitio se ofrece “tal cual” y “según disponibilidad”. En la medida permitida por la ley, MÍTICA BURGERS no será responsable por:'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />

            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <li>{isEnglish ? 'Site interruptions due to maintenance, technical failures, or causes beyond our control.' : 'Interrupciones del Sitio por mantenimiento, fallas técnicas o causas fuera de control.'}</li>
              <li>{isEnglish ? 'Damages resulting from improper use of the Site by the user.' : 'Daños derivados del uso indebido del Sitio por parte del usuario.'}</li>
              <li>{isEnglish ? 'Reasonable variations in products, prices, availability, or estimated times.' : 'Variaciones razonables en productos, precios, disponibilidad o tiempos estimados.'}</li>
              <li>{isEnglish ? 'Third-party content or services linked from the Site.' : 'Contenido o servicios de terceros enlazados desde el Sitio.'}</li>
            </ul>
          </div>

          {/* 10 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '10) Privacy' : '10) Privacidad'}
            </h2>

            <p className="mt-3 text-gray-700 font-rethink leading-relaxed">
              {isEnglish
                ? 'The processing of personal data is governed by the MÍTICA BURGERS Privacy Notice, available on the Site. By using the Site, you acknowledge that you have read and understood it. '
                : 'El tratamiento de datos personales se rige por el Aviso de Privacidad de MÍTICA BURGERS, disponible en el Sitio. Al usar el Sitio, usted reconoce haberlo leído y entendido. '}
              <Link
                to={localizedPath('/aviso-de-privacidad')}
                className="font-bold underline hover:text-mitica-yellow transition-colors"
              >
                {isEnglish ? 'View Privacy Notice' : 'Ver Aviso de Privacidad'}
              </Link>
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '11) Changes to the Terms' : '11) Modificaciones a los Términos'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'MÍTICA BURGERS may update these Terms at any time. The current version will be the one published on the Site with its last updated date. Continued use of the Site implies acceptance of the changes.'
                  : 'MÍTICA BURGERS podrá actualizar estos Términos en cualquier momento. La versión vigente será la publicada en el Sitio con su fecha de última actualización. El uso continuado del Sitio implica la aceptación de los cambios.'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 12 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '12) Applicable law and jurisdiction' : '12) Legislación aplicable y jurisdicción'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'These Terms are governed by the applicable laws of the United Mexican States. For any dispute, the parties submit to the jurisdiction of the competent courts of Mérida, Yucatán, waiving any other jurisdiction that may correspond to them.'
                  : 'Estos Términos se rigen por las leyes aplicables de los Estados Unidos Mexicanos. Para cualquier controversia, las partes se someten a la jurisdicción de los tribunales competentes de Mérida, Yucatán, renunciando a cualquier otro fuero que pudiera corresponderles.'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Terms
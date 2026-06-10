// src/pages/Privacy.tsx
import React from 'react'
import { Title, TitleVariant, BodyText } from '../components/Typography'
import { useSiteLanguage } from '../i18n'

const Privacy = () => {
  const { isEnglish } = useSiteLanguage()

  return (
    <section className="bg-white pt-24 md:pt-28">
      <div className="container mx-auto px-6 md:px-10 py-16 md:py-20 max-w-4xl">
        <Title
          variant={TitleVariant.TEXTURED}
          text={isEnglish ? 'Comprehensive Privacy Notice' : 'Aviso de Privacidad Integral'}
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
                ? 'MÍTICA BURGERS, located at Calle 27 #86, Colonia Chichén-Itzá, Mérida, Yucatán, Mexico (hereinafter, “MÍTICA BURGERS”), is responsible for the processing of the personal data of its customers and users, in accordance with the Federal Law on the Protection of Personal Data Held by Private Parties, its Regulations, and other applicable provisions.'
                : 'MÍTICA BURGERS, con domicilio en Calle 27 #86, Colonia Chichén-Itzá, Mérida, Yucatán, México (en adelante, “MÍTICA BURGERS”), es responsable del tratamiento de los datos personales de sus clientes y usuarios, de conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, su Reglamento y demás disposiciones aplicables.'
            }
            className="text-gray-700 leading-relaxed"
            align="left"
          />

          {/* 1 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '1) Personal data we collect' : '1) Datos personales que recabamos'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'To comply with the purposes described in this Privacy Notice, MÍTICA BURGERS may collect personal data through our mobile application, website, call center, and/or chatbot, as applicable.'
                  : 'Para cumplir con las finalidades descritas en el presente Aviso de Privacidad, MÍTICA BURGERS podrá recabar datos personales a través de nuestra aplicación móvil, sitio web, call center y/o chatbot, según corresponda.'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-nexa text-lg uppercase tracking-wide text-mitica-black">
                  {isEnglish ? 'A) App users' : 'A) Usuarios de la app'}
                </h3>

                <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
                  <li>
                    <span className="font-bold text-gray-900">
                      {isEnglish ? 'Identification and contact:' : 'Identificación y contacto:'}
                    </span>{' '}
                    {isEnglish
                      ? 'full name, phone number, email address.'
                      : 'nombre completo, número de teléfono, correo electrónico.'}
                  </li>
                  <li>
                    <span className="font-bold text-gray-900">
                      {isEnglish ? 'Address:' : 'Domicilio:'}
                    </span>{' '}
                    {isEnglish
                      ? 'state, municipality, and postal code.'
                      : 'entidad federativa, municipio y código postal.'}
                  </li>
                  <li>
                    <span className="font-bold text-gray-900">
                      {isEnglish ? 'Transaction data:' : 'Datos de transacción:'}
                    </span>{' '}
                    {isEnglish
                      ? 'information related to your orders, such as order details and charged amount.'
                      : 'información relacionada con sus pedidos (por ejemplo, detalles del pedido y monto cobrado).'}
                  </li>
                  <li>
                    <span className="font-bold text-gray-900">
                      {isEnglish ? 'Platform usage data:' : 'Datos sobre el uso de la plataforma:'}
                    </span>{' '}
                    {isEnglish
                      ? 'information about how you interact with our services, such as sections viewed or actions within the app.'
                      : 'información sobre cómo interactúa con nuestros servicios (por ejemplo, secciones consultadas o acciones dentro de la app).'}
                  </li>
                  <li>
                    <span className="font-bold text-gray-900">
                      {isEnglish ? 'Location:' : 'Ubicación:'}
                    </span>{' '}
                    {isEnglish
                      ? 'MÍTICA BURGERS does not automatically collect your location. If any app functionality requests location access, it will only be collected if the user authorizes it from their device and will be informed at the appropriate time.'
                      : 'MÍTICA BURGERS no recaba su ubicación de manera automática. En caso de que alguna funcionalidad de la app llegue a solicitar acceso a ubicación, ésta se recabará únicamente si el usuario lo autoriza desde su dispositivo y se informará en el momento correspondiente.'}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-nexa text-lg uppercase tracking-wide text-mitica-black">
                  {isEnglish ? 'B) Website users' : 'B) Usuarios del sitio web'}
                </h3>

                <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
                  <li>{isEnglish ? 'Full name' : 'Nombre completo'}</li>
                  <li>{isEnglish ? 'Phone number' : 'Número de teléfono'}</li>
                  <li>{isEnglish ? 'Email address' : 'Correo electrónico'}</li>
                  <li>
                    {isEnglish
                      ? '(If applicable) username or profile data linked to social media only if you voluntarily provide it through a form or interaction.'
                      : '(En su caso) nombre de usuario o dato de perfil vinculado a redes sociales solo si usted lo proporciona voluntariamente mediante algún formulario o interacción.'}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-nexa text-lg uppercase tracking-wide text-mitica-black">
                  {isEnglish ? 'C) Through call center / chatbot' : 'C) A través del call center / chatbot'}
                </h3>

                <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
                  <li>{isEnglish ? 'Full name' : 'Nombre completo'}</li>
                  <li>{isEnglish ? 'Phone number' : 'Número de teléfono'}</li>
                  <li>{isEnglish ? 'Email address' : 'Correo electrónico'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '2) Purposes of processing' : '2) Finalidades del tratamiento'}
            </h2>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-nexa text-lg uppercase tracking-wide text-mitica-black">
                  {isEnglish ? 'A) Primary purposes' : 'A) Finalidades primarias (necesarias)'}
                </h3>

                <BodyText
                  text={
                    isEnglish
                      ? 'The personal data collected will be used to:'
                      : 'Los datos personales recabados serán utilizados para:'
                  }
                  className="mt-3 text-gray-700 leading-relaxed"
                  align="left"
                />

                <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
                  <li>{isEnglish ? 'Identify users.' : 'Identificar a los usuarios.'}</li>
                  <li>{isEnglish ? 'Create and manage accounts, when applicable.' : 'Crear y administrar cuentas (cuando aplique).'}</li>
                  <li>{isEnglish ? 'Operate and manage our app and/or website.' : 'Operar y administrar nuestra app y/o sitio web.'}</li>
                  <li>{isEnglish ? 'Provide and manage the requested products and services.' : 'Proporcionar y administrar los productos y servicios solicitados.'}</li>
                  <li>{isEnglish ? 'Manage orders and, when applicable, home delivery.' : 'Gestionar pedidos y, cuando aplique, la entrega a domicilio.'}</li>
                  <li>
                    {isEnglish
                      ? 'Respond to questions, comments, complaints, suggestions, and/or information requests.'
                      : 'Atender preguntas, comentarios, quejas, sugerencias y/o solicitudes de información.'}
                  </li>
                  <li>{isEnglish ? 'Communicate with you regarding your orders, services, or customer support.' : 'Comunicarnos con usted respecto de sus pedidos, servicios o atención.'}</li>
                  <li>{isEnglish ? 'Evaluate the quality of our services.' : 'Evaluar la calidad de nuestros servicios.'}</li>
                  <li>
                    {isEnglish
                      ? 'Issue electronic invoices when requested by the user and when the necessary data is provided.'
                      : 'Realizar la facturación electrónica correspondiente cuando el usuario la solicite y proporcione los datos necesarios.'}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-nexa text-lg uppercase tracking-wide text-mitica-black">
                  {isEnglish ? 'B) Secondary purposes' : 'B) Finalidades secundarias (opcionales)'}
                </h3>

                <BodyText
                  text={
                    isEnglish
                      ? 'Additionally, and unless you object, MÍTICA BURGERS may process some personal data to:'
                      : 'De manera adicional, y si usted no se opone, MÍTICA BURGERS podrá tratar algunos datos personales para:'
                  }
                  className="mt-3 text-gray-700 leading-relaxed"
                  align="left"
                />

                <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
                  <li>{isEnglish ? 'Send advertising, promotions, and offers.' : 'Enviarle publicidad, promociones y ofertas.'}</li>
                  <li>
                    {isEnglish
                      ? 'Perform analysis to understand preferences and improve products, services, and customer care.'
                      : 'Realizar análisis para comprender preferencias y mejorar productos, servicios y atención al cliente.'}
                  </li>
                </ul>

                <p className="mt-4 text-gray-700 font-rethink leading-relaxed">
                  {isEnglish
                    ? 'If you do not want your personal data to be used for these secondary purposes, you may state this by sending an email to: '
                    : 'Si no desea que sus datos personales se utilicen para estas finalidades secundarias, puede manifestarlo enviando un correo a: '}
                  <a
                    href="mailto:marketing@miticaburgers.com?subject=Oposición%20a%20finalidades%20secundarias"
                    className="font-bold underline hover:text-mitica-yellow transition-colors"
                  >
                    marketing@miticaburgers.com
                  </a>{' '}
                  {isEnglish
                    ? '(subject: “Opposition to secondary purposes”).'
                    : '(asunto: “Oposición a finalidades secundarias”).'}
                </p>
              </div>
            </div>
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '3) Security measures' : '3) Medidas de seguridad'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'MÍTICA BURGERS protects personal data through reasonable administrative, physical, and technical security measures, in order to protect it against damage, loss, alteration, destruction, unauthorized use, access, or processing.'
                  : 'MÍTICA BURGERS resguarda los datos personales bajo medidas de seguridad administrativas, físicas y técnicas razonables, con el objeto de protegerlos contra daño, pérdida, alteración, destrucción, uso, acceso o tratamiento no autorizado.'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '4) Use of platforms and providers' : '4) Uso de plataformas y proveedores (encargados)'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'To operate our website and manage content, MÍTICA BURGERS uses third-party services that may process personal data only as providers and under our instructions, such as:'
                  : 'Para operar nuestro sitio web y administrar contenido, MÍTICA BURGERS utiliza servicios de terceros que pueden tratar datos personales únicamente como proveedores y bajo nuestras instrucciones, tales como:'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />

            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <li>{isEnglish ? 'Vercel, website hosting/infrastructure service.' : 'Vercel (servicio de hosting/infraestructura del sitio web).'}</li>
              <li>{isEnglish ? 'Sanity, content management platform.' : 'Sanity (plataforma de administración de contenido).'}</li>
            </ul>

            <BodyText
              text={
                isEnglish
                  ? 'These providers act as processors, so they may not use the information for purposes other than providing the contracted service.'
                  : 'Estos proveedores actúan como encargados, por lo que no podrán usar la información para fines distintos a la prestación del servicio contratado.'
              }
              className="mt-4 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '5) Website map without geolocation' : '5) Mapa del sitio web (sin geolocalización)'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'The website may display a map for informational purposes, such as locating branches. This map does not use the user’s current location or request geolocation permissions.'
                  : 'El sitio web puede mostrar un mapa con fines informativos (por ejemplo, para ubicar sucursales). Dicho mapa no utiliza la ubicación actual del usuario ni solicita permisos de geolocalización.'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '6) Personal data transfers' : '6) Transferencias de datos personales'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'MÍTICA BURGERS does not transfer your personal data to unrelated third parties, except in legally established cases, by request of a competent authority, or when necessary to comply with applicable legal obligations.'
                  : 'MÍTICA BURGERS no transfiere sus datos personales a terceros ajenos, salvo en los casos legalmente previstos, por requerimiento de autoridad competente o cuando sea necesario para cumplir obligaciones legales aplicables.'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 7 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '7) ARCO rights and consent revocation' : '7) Derechos ARCO y revocación del consentimiento'}
            </h2>

            <p className="mt-3 text-gray-700 font-rethink leading-relaxed">
              {isEnglish
                ? 'You, or your legal representative, may exercise your rights of Access, Rectification, Cancellation, or Opposition (ARCO), as well as revoke consent for the processing of your data or limit its use or disclosure, by sending a request to: '
                : 'Usted (o su representante legal) puede ejercer sus derechos de Acceso, Rectificación, Cancelación u Oposición (ARCO), así como revocar el consentimiento para el tratamiento de sus datos o limitar su uso o divulgación, enviando una solicitud al correo: '}
              <a
                href="mailto:marketing@miticaburgers.com"
                className="font-bold underline hover:text-mitica-yellow transition-colors"
              >
                marketing@miticaburgers.com
              </a>
              .
            </p>

            <BodyText
              text={
                isEnglish
                  ? 'In order to process your request, you must include:'
                  : 'Para poder atender su solicitud, deberá incluir:'
              }
              className="mt-4 text-gray-700 leading-relaxed"
              align="left"
            />

            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 font-rethink leading-relaxed">
              <li>{isEnglish ? 'Name of the data subject and a way to communicate the response.' : 'Nombre del titular y medio para comunicar la respuesta.'}</li>
              <li>{isEnglish ? 'Clear description of the right you wish to exercise and the related data.' : 'Descripción clara del derecho que desea ejercer y los datos relacionados.'}</li>
              <li>
                {isEnglish
                  ? 'Copy of an official identification of the data subject and, if applicable, document proving legal representation.'
                  : 'Copia de una identificación oficial del titular (y, en su caso, documento que acredite la representación legal).'}
              </li>
              <li>{isEnglish ? 'Any additional information that helps locate the data.' : 'Cualquier información adicional que facilite la localización de los datos.'}</li>
            </ul>
          </div>

          {/* 8 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '8) Data retention' : '8) Conservación de los datos'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'MÍTICA BURGERS will retain personal data only for the time necessary to fulfill the purposes described in this Privacy Notice and the periods required by applicable law. Once there is no longer a purpose or legal retention obligation, the data will be deleted or anonymized as appropriate.'
                  : 'MÍTICA BURGERS conservará los datos personales únicamente durante el tiempo necesario para cumplir con las finalidades descritas en este Aviso de Privacidad y los plazos exigidos por la legislación aplicable. Una vez que ya no exista una finalidad o una obligación legal de conservación, los datos serán eliminados o anonimizados conforme corresponda.'
              }
              className="mt-3 text-gray-700 leading-relaxed"
              align="left"
            />
          </div>

          {/* 9 */}
          <div>
            <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-mitica-black">
              {isEnglish ? '9) Changes to the Privacy Notice' : '9) Cambios al Aviso de Privacidad'}
            </h2>

            <BodyText
              text={
                isEnglish
                  ? 'This Privacy Notice may be modified to comply with legal requirements or operational needs. The updated version will be available on the official MÍTICA BURGERS website.'
                  : 'El presente Aviso de Privacidad puede modificarse para cumplir requerimientos legales o por necesidades operativas. La versión actualizada estará disponible en el sitio web oficial de MÍTICA BURGERS.'
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

export default Privacy
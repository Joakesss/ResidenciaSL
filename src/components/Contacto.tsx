import { contenido } from "@/content/residencia";
import { linkWhatsapp, linkComoLlegar } from "@/lib/links";
import Seccion from "./Seccion";

const MENSAJE = "¡Hola! Quería hacer una consulta sobre la residencia.";

export default function Contacto() {
  const { contacto } = contenido;
  return (
    <Seccion
      id="contacto"
      titulo="Hablemos"
      bajada="La forma más rápida de sacarte una duda es escribirnos. Contestamos por WhatsApp todos los días."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <a
          href={linkWhatsapp(contacto.whatsapp, MENSAJE)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-borde bg-superficie p-7 hover:border-terracota transition-colors"
        >
          <h3 className="font-display text-xl text-terracota-fuerte">WhatsApp</h3>
          <p className="mt-2 text-2xl text-tinta">{contacto.whatsappMostrado}</p>
          <p className="mt-2 text-sm text-tinta-suave">Tocá para abrir el chat.</p>
        </a>
        <a
          href={linkComoLlegar("Mi ubicación", contacto.direccion)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-borde bg-superficie p-7 hover:border-terracota transition-colors"
        >
          <h3 className="font-display text-xl text-terracota-fuerte">Dónde estamos</h3>
          <p className="mt-2 text-lg text-tinta">{contacto.direccion}</p>
          <p className="mt-2 text-sm text-tinta-suave">Tocá para abrir el mapa.</p>
        </a>
      </div>
    </Seccion>
  );
}

import { contenido } from "@/content/residencia";
import { linkWhatsapp } from "@/lib/links";

const MENSAJE = "¡Hola! Quiero preinscribirme en la residencia.";

export default function Preinscripcion() {
  const { preinscripcion, contacto } = contenido;

  /**
   * Si todavia no se cargo el Google Form, el boton cae a WhatsApp.
   * Un CTA muerto (href vacio o "#") justo en el punto de conversion
   * es la peor falla posible de este sitio.
   */
  const hayFormulario = preinscripcion.urlFormulario.trim().length > 0;

  const destino = hayFormulario
    ? preinscripcion.urlFormulario
    : linkWhatsapp(contacto.whatsapp, MENSAJE);

  const etiqueta = hayFormulario
    ? "Ir al formulario de preinscripción"
    : "Escribinos por WhatsApp";

  return (
    <section id="preinscripcion" className="bg-terracota-fuerte py-20 text-white sm:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="font-display text-3xl sm:text-5xl">{preinscripcion.titulo}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">{preinscripcion.texto}</p>
        <a
          href={destino}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-9 inline-block rounded-full bg-white px-9 py-4 font-medium text-terracota-fuerte hover:bg-crema transition-colors"
        >
          {etiqueta}
        </a>
        <p className="mt-5 text-sm text-white/70">
          Sin costo y sin compromiso. Te contactamos para coordinar una visita.
        </p>
      </div>
    </section>
  );
}

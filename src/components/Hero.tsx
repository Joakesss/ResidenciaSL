import { contenido } from "@/content/residencia";
import { linkWhatsapp } from "@/lib/links";

const MENSAJE = "¡Hola! Vi la web y quería consultar por una habitación.";

export default function Hero() {
  const { sitio, contacto, preinscripcion } = contenido;
  return (
    <section id="inicio" className="relative pt-16">
      <div className="relative min-h-[85vh] flex items-center">
        <img
          src="/img/Entorno2.jpeg"
          alt="La cuadra de la residencia, arbolada y frente a un espacio verde"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Degradado: sostiene el contraste del texto sobre cualquier foto */}
        <div className="absolute inset-0 bg-gradient-to-r from-tinta/85 via-tinta/60 to-tinta/25" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">
            {contacto.localidad}
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl max-w-3xl leading-tight">
            {sitio.tagline}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/90">
            Habitaciones privadas individuales y una grande, compartida o
            privada. Amobladas, con internet y limpieza de espacios comunes
            incluidos. Somos una casa de hasta 4 personas: tranquila, cuidada y
            cerca de todo.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#preinscripcion"
              className="rounded-full bg-terracota-fuerte px-7 py-3.5 font-medium hover:bg-terracota-oscuro transition-colors"
            >
              {preinscripcion.titulo}
            </a>
            <a
              href={linkWhatsapp(contacto.whatsapp, MENSAJE)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-white/70 px-7 py-3.5 font-medium hover:bg-white hover:text-tinta transition-colors"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

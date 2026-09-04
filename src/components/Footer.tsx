import { contenido } from "@/content/residencia";

export default function Footer() {
  const { sitio, contacto } = contenido;
  return (
    <footer className="border-t border-borde bg-arena py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-sm text-tinta-suave sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-base text-terracota-fuerte">{sitio.nombre}</p>
        <p>{contacto.direccion}</p>
        <p>WhatsApp {contacto.whatsappMostrado}</p>
      </div>
    </footer>
  );
}

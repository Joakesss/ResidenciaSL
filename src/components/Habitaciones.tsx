import { contenido } from "@/content/residencia";
import { linkWhatsapp } from "@/lib/links";
import type { Disponibilidad } from "@/content/tipos";
import Seccion from "./Seccion";

const BADGE: Record<Disponibilidad, { texto: string; clase: string }> = {
  disponible: { texto: "Disponible", clase: "bg-verde-claro text-verde" },
  ocupada: { texto: "Ocupada", clase: "bg-arena text-tinta-suave" },
  consultar: { texto: "Consultar", clase: "bg-terracota-claro text-terracota-fuerte" },
};

export default function Habitaciones() {
  const { habitaciones, contacto } = contenido;
  return (
    <Seccion
      id="habitaciones"
      titulo="Las habitaciones"
      bajada="Dos privadas individuales y una grande, que puede ser compartida o privada. En total somos hasta 4 personas en la casa, así que los espacios comunes nunca se sienten llenos."
    >
      <ul className="grid gap-6 md:grid-cols-3">
        {habitaciones.map((h) => {
          const badge = BADGE[h.disponibilidad];
          return (
            <li key={h.id}>
              <article className="h-full overflow-hidden rounded-2xl border border-borde bg-superficie flex flex-col">
                <img src={h.imagen} alt={h.nombre} className="h-52 w-full object-cover" />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl text-tinta">{h.nombre}</h3>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badge.clase}`}>
                      {badge.texto}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-tinta-suave flex-1">{h.descripcion}</p>
                  <p className="mt-4 text-sm text-tinta-suave">
                    {h.ocupacion ??
                      `Para ${h.capacidad} ${h.capacidad === 1 ? "persona" : "personas"}`}
                  </p>
                  <a
                    href={linkWhatsapp(
                      contacto.whatsapp,
                      `¡Hola! Quería consultar por la ${h.nombre.toLowerCase()}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block rounded-full border border-terracota-fuerte px-5 py-2.5 text-center text-sm font-medium text-terracota-fuerte hover:bg-terracota-fuerte hover:text-white transition-colors"
                  >
                    Consultar valores
                  </a>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </Seccion>
  );
}

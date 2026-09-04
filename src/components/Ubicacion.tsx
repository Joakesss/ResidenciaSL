import { contenido } from "@/content/residencia";
import { linkMapaEmbed, linkComoLlegar } from "@/lib/links";
import Seccion from "./Seccion";

const ETIQUETA: Record<string, string> = {
  universidad: "Universidad",
  transporte: "Transporte",
  comercio: "Comercios",
  ciudad: "Ciudad",
};

export default function Ubicacion() {
  const { contacto, lugaresCercanos } = contenido;

  return (
    <Seccion
      id="ubicacion"
      titulo="Dónde estamos"
      bajada="Tocá “Cómo llegar” en cualquier lugar y Google Maps te calcula la ruta real desde la puerta de la residencia."
      fondo="blanco"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl border border-borde">
            <iframe
              src={linkMapaEmbed(contacto.direccion)}
              title={`Mapa: ${contacto.direccion}`}
              className="h-[380px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-4 font-display text-lg text-tinta">{contacto.direccion}</p>
          <a
            href={linkComoLlegar("Mi ubicación", contacto.direccion)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-full bg-terracota-fuerte px-6 py-3 text-sm font-medium text-white hover:bg-terracota-oscuro transition-colors"
          >
            Cómo llegar a la residencia
          </a>
        </div>

        <div>
          <h3 className="font-display text-2xl text-terracota-fuerte">Qué tenés cerca</h3>
          <ul className="mt-5 space-y-3">
            {lugaresCercanos.map((lugar) => (
              <li key={lugar.id} className="rounded-2xl border border-borde bg-crema p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-terracota">
                      {ETIQUETA[lugar.categoria]}
                    </span>
                    <h4 className="font-display text-lg text-tinta">{lugar.nombre}</h4>
                    <p className="mt-1 text-sm text-tinta-suave">{lugar.descripcion}</p>
                    {/* Solo se muestra si fue verificado. Ver PREGUNTA(distancias). */}
                    {lugar.minutosCaminando !== null && (
                      <p className="mt-1 text-sm font-medium text-verde">
                        {lugar.minutosCaminando} min caminando
                      </p>
                    )}
                  </div>
                  <a
                    href={linkComoLlegar(contacto.direccion, lugar.direccion)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-full border border-terracota-fuerte px-4 py-2 text-sm text-terracota-fuerte hover:bg-terracota-fuerte hover:text-white transition-colors"
                  >
                    Cómo llegar
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Seccion>
  );
}

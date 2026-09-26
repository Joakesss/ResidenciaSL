import { contenido } from "@/content/residencia";
import Seccion from "./Seccion";
import Icono from "./Icono";

export default function Servicios() {
  return (
    <Seccion
      id="servicios"
      titulo="Qué incluye"
      bajada="Internet, el agua, la limpieza de los espacios comunes y la calefacción están incluidos en el alquiler. La luz y el gas se pagan aparte y se dividen entre los residentes: cuidándolos entre todos, cada uno paga menos."
      fondo="arena"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {contenido.servicios.map((s) => (
          <li
            key={s.id}
            className={`rounded-2xl border p-6 ${
              s.destacado
                ? "border-terracota bg-terracota-claro"
                : "border-borde bg-superficie"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-terracota-fuerte text-white">
                <Icono nombre={s.icono} />
              </span>
              {/* Mientras el servicio siga "a-confirmar" no se afirma que esta
                  incluido. */}
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  s.incluido === "si"
                    ? "bg-verde-claro text-verde"
                    : "bg-arena text-tinta-suave"
                }`}
              >
                {s.incluido === "si" ? "Incluido" : s.incluido === "aparte" ? "Aparte" : "Consultar"}
              </span>
            </div>
            <h3 className="mt-4 font-display text-xl text-tinta">{s.nombre}</h3>
            <p className="mt-1.5 text-sm text-tinta-suave">{s.detalle}</p>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}

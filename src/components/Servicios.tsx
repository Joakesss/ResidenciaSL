import { contenido } from "@/content/residencia";
import Seccion from "./Seccion";
import Icono from "./Icono";

export default function Servicios() {
  return (
    <Seccion
      id="servicios"
      titulo="Todo incluido"
      bajada="Sin facturas aparte ni sorpresas a fin de mes. Un solo pago y listo."
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
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-terracota-fuerte text-white">
              <Icono nombre={s.icono} />
            </span>
            <h3 className="mt-4 font-display text-xl text-tinta">{s.nombre}</h3>
            <p className="mt-1.5 text-sm text-tinta-suave">{s.detalle}</p>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}

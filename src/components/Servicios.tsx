import { contenido } from "@/content/residencia";
import type { EstadoInclusion, Servicio } from "@/content/tipos";
import Seccion from "./Seccion";
import Icono from "./Icono";

const GRUPOS: Record<
  EstadoInclusion,
  { titulo: string; aclaracion: string; marca: string; claseMarca: string }
> = {
  si: {
    titulo: "Incluido en el alquiler",
    aclaracion: "No pagás nada extra por esto.",
    marca: "check",
    claseMarca: "bg-verde text-white",
  },
  aparte: {
    titulo: "Se paga aparte",
    aclaracion: "Cuidándolos entre todos, cada uno paga menos.",
    marca: "mas",
    claseMarca: "bg-tinta-suave text-white",
  },
  // Mientras un servicio siga "a-confirmar" no se afirma que esta incluido.
  "a-confirmar": {
    titulo: "A confirmar",
    aclaracion: "Todavía lo estamos definiendo. Consultanos y te contamos.",
    marca: "pregunta",
    claseMarca: "bg-terracota text-white",
  },
};

function Grupo({ estado, servicios }: { estado: EstadoInclusion; servicios: Servicio[] }) {
  const grupo = GRUPOS[estado];
  const idTitulo = `servicios-${estado}`;
  return (
    <section
      aria-labelledby={idTitulo}
      className="rounded-2xl border border-borde bg-superficie p-6 sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${grupo.claseMarca}`}
        >
          <Icono nombre={grupo.marca} className="h-4 w-4" />
        </span>
        <h3 id={idTitulo} className="font-display text-2xl text-tinta">
          {grupo.titulo}
        </h3>
      </div>
      <p className="mt-2 text-sm text-tinta-suave">{grupo.aclaracion}</p>

      <ul className="mt-4 divide-y divide-borde">
        {servicios.map((s) => (
          <li key={s.id} className="flex gap-4 py-4 last:pb-0">
            <span
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                s.destacado
                  ? "bg-terracota-fuerte text-white"
                  : "bg-terracota-claro text-terracota-fuerte"
              }`}
            >
              <Icono nombre={s.icono} />
            </span>
            <div>
              <h4 className="font-medium text-tinta">{s.nombre}</h4>
              <p className="mt-0.5 text-sm text-tinta-suave">{s.detalle}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Servicios() {
  const porEstado = (estado: EstadoInclusion) =>
    contenido.servicios.filter((s) => s.incluido === estado);
  const incluidos = porEstado("si");
  const resto = (["aparte", "a-confirmar"] as const)
    .map((estado) => ({ estado, servicios: porEstado(estado) }))
    .filter((g) => g.servicios.length > 0);

  return (
    <Seccion
      id="servicios"
      titulo="Qué incluye"
      bajada="De un vistazo: qué cubre el alquiler y qué se paga por separado."
      fondo="arena"
    >
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Grupo estado="si" servicios={incluidos} />
        </div>
        <div className="grid gap-6 lg:col-span-2">
          {resto.map((g) => (
            <Grupo key={g.estado} estado={g.estado} servicios={g.servicios} />
          ))}
        </div>
      </div>
    </Seccion>
  );
}

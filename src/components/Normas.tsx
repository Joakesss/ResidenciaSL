import { contenido } from "@/content/residencia";
import Seccion from "./Seccion";

export default function Normas() {
  return (
    <Seccion
      id="normas"
      titulo="Cómo convivimos"
      bajada="Pocas reglas, claras desde el principio. Están para que la casa sea un buen lugar donde estudiar y descansar."
    >
      <ul className="grid gap-5 sm:grid-cols-2">
        {contenido.normas.map((n, i) => (
          <li key={n.id} className="flex gap-4 rounded-2xl border border-borde bg-superficie p-6">
            <span aria-hidden="true" className="font-display text-2xl text-terracota">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-lg text-tinta">{n.titulo}</h3>
              <p className="mt-1 text-sm text-tinta-suave">{n.detalle}</p>
            </div>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}

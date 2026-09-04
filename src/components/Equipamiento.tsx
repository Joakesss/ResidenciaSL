import { contenido } from "@/content/residencia";
import type { ItemEquipamiento } from "@/content/tipos";
import Seccion from "./Seccion";

function Lista({ items }: { items: ItemEquipamiento[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((e) => (
        <li key={e.id} className="flex items-center gap-3 text-tinta-suave">
          <span aria-hidden="true" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-verde-claro text-verde text-xs">
            ✓
          </span>
          {e.nombre}
        </li>
      ))}
    </ul>
  );
}

export default function Equipamiento() {
  const propio = contenido.equipamiento.filter((e) => e.uso === "propio");
  const compartido = contenido.equipamiento.filter((e) => e.uso === "compartido");

  return (
    <Seccion
      id="equipamiento"
      titulo="Qué vas a encontrar"
      bajada="La casa viene equipada. Vos traés tus cosas y poco más."
      fondo="arena"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-borde bg-superficie p-7">
          <h3 className="font-display text-2xl text-terracota-fuerte">En tu habitación</h3>
          <p className="mt-1 text-sm text-tinta-suave">De uso exclusivo tuyo.</p>
          <Lista items={propio} />
        </div>
        <div className="rounded-2xl border border-borde bg-superficie p-7">
          <h3 className="font-display text-2xl text-terracota-fuerte">Espacios compartidos</h3>
          {/* El numero es lo que vuelve tolerable lo compartido. Va siempre visible. */}
          <p className="mt-1 text-sm text-tinta-suave">
            Compartidos entre <strong className="text-tinta">4 personas</strong> en total.
            La limpieza de estos espacios la hacemos nosotros.
          </p>
          <Lista items={compartido} />
        </div>
      </div>
    </Seccion>
  );
}

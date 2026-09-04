"use client";

import { useEffect, useState, useCallback } from "react";
import { contenido } from "@/content/residencia";
import Seccion from "./Seccion";

export default function Galeria() {
  const items = contenido.galeria;
  const [indice, setIndice] = useState<number | null>(null);
  const abierto = indice !== null;

  const cerrar = useCallback(() => setIndice(null), []);
  const mover = useCallback(
    (delta: number) =>
      setIndice((i) => (i === null ? null : (i + delta + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    document.addEventListener("keydown", onKey);
    // Evita que la pagina siga scrolleando detras del lightbox
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [abierto, cerrar, mover]);

  const actual = indice !== null ? items[indice] : null;

  return (
    <Seccion
      id="galeria"
      titulo="Conocé la casa"
      bajada="Así es la residencia por dentro. Si querés verla en persona, escribinos y coordinamos una visita."
      fondo="blanco"
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setIndice(i)}
              aria-label={`Ampliar: ${item.alt}`}
              className="group block w-full overflow-hidden rounded-xl border border-borde focus:outline-none focus:ring-2 focus:ring-terracota-fuerte"
            >
              <img
                src={item.tipo === "video" ? (item.poster ?? item.src) : item.src}
                alt={item.alt}
                className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      {actual && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={actual.alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-tinta/90 p-4"
          onClick={cerrar}
        >
          <div className="relative max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {actual.tipo === "video" ? (
              <video src={actual.src} poster={actual.poster} controls
                className="max-h-[80vh] w-full rounded-lg" />
            ) : (
              <img src={actual.src} alt={actual.alt}
                className="max-h-[80vh] w-full rounded-lg object-contain" />
            )}
            <p className="mt-3 text-center text-sm text-white/90">{actual.alt}</p>
          </div>

          <button type="button" onClick={cerrar} aria-label="Cerrar"
            className="absolute right-4 top-4 rounded-full bg-white/15 px-4 py-2 text-2xl leading-none text-white hover:bg-white/25">
            ×
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); mover(-1); }} aria-label="Anterior"
            className="absolute left-3 rounded-full bg-white/15 px-4 py-3 text-white hover:bg-white/25">
            ‹
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); mover(1); }} aria-label="Siguiente"
            className="absolute right-3 rounded-full bg-white/15 px-4 py-3 text-white hover:bg-white/25">
            ›
          </button>
        </div>
      )}
    </Seccion>
  );
}

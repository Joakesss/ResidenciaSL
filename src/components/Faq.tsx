"use client";

import { useState } from "react";
import { contenido } from "@/content/residencia";
import Seccion from "./Seccion";

export default function Faq() {
  const [abierta, setAbierta] = useState<string | null>(null);

  return (
    <Seccion
      id="faq"
      titulo="Preguntas frecuentes"
      bajada="Si tu pregunta no está acá, escribinos por WhatsApp: contestamos rápido."
      fondo="arena"
    >
      <ul className="mx-auto max-w-3xl space-y-3">
        {contenido.faq.map((p) => {
          const activa = abierta === p.id;
          return (
            <li key={p.id} className="overflow-hidden rounded-2xl border border-borde bg-superficie">
              <button
                type="button"
                onClick={() => setAbierta(activa ? null : p.id)}
                aria-expanded={activa}
                aria-controls={`faq-${p.id}`}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-medium text-tinta">{p.pregunta}</span>
                <span aria-hidden="true" className={`shrink-0 text-2xl text-terracota transition-transform ${activa ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              {activa && (
                <div id={`faq-${p.id}`} className="border-t border-borde px-6 py-5 text-tinta-suave">
                  {p.respuesta}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Seccion>
  );
}

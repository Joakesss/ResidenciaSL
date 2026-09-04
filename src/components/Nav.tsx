"use client";

import { useState } from "react";

const SECCIONES = [
  { href: "#habitaciones", label: "Habitaciones" },
  { href: "#galeria", label: "Fotos" },
  { href: "#equipamiento", label: "Equipamiento" },
  { href: "#normas", label: "Normas" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#faq", label: "Preguntas" },
];

export default function Nav() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-crema/95 backdrop-blur border-b border-borde">
      <nav className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
        <a href="#inicio" className="font-display text-lg text-terracota-fuerte leading-tight">
          Residencia <span className="hidden sm:inline">Estudiantil</span>
          <span className="block text-xs font-sans text-tinta-suave">San Luis</span>
        </a>

        <ul className="hidden lg:flex items-center gap-6 text-sm">
          {SECCIONES.map((s) => (
            <li key={s.href}>
              <a href={s.href} className="text-tinta-suave hover:text-terracota-fuerte transition-colors">
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#preinscripcion"
            className="hidden sm:inline-block rounded-full bg-terracota-fuerte px-5 py-2 text-sm font-medium text-white hover:bg-terracota transition-colors"
          >
            Preinscribirme
          </a>
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-mobile"
            aria-label="Menú"
            className="lg:hidden rounded-md p-2 text-tinta hover:bg-arena"
          >
            <span aria-hidden="true" className="block w-6 border-t-2 border-current" />
            <span aria-hidden="true" className="block w-6 border-t-2 border-current mt-1.5" />
            <span aria-hidden="true" className="block w-6 border-t-2 border-current mt-1.5" />
          </button>
        </div>
      </nav>

      {abierto && (
        <ul id="menu-mobile" className="lg:hidden border-t border-borde bg-crema px-4 py-3 space-y-1">
          {[...SECCIONES, { href: "#preinscripcion", label: "Preinscribirme" }].map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                onClick={() => setAbierto(false)}
                className="block rounded-md px-3 py-2.5 text-tinta hover:bg-arena"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

/** Iconos inline. Sin libreria externa: son pocos y pesan menos asi. */
const PATHS: Record<string, string> = {
  check: "M5 13l4 4L19 7",
  mas: "M12 5v14M5 12h14",
  pregunta: "M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01",
  wifi: "M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01",
  escoba: "M19 5l-7 7M8 21l-3-3 6-6 3 3-6 6zM14 10l3-3",
  luz: "M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z",
  agua: "M12 2.7s6 6.4 6 10.3a6 6 0 11-12 0c0-3.9 6-10.3 6-10.3z",
  gas: "M12 2s5 5 5 9a5 5 0 11-10 0c0-4 5-9 5-9zM12 16a2 2 0 002-2c0-1.5-2-3-2-3s-2 1.5-2 3a2 2 0 002 2z",
  calefaccion: "M4 20h16M6 20V9M10 20V9M14 20V9M18 20V9M4 9h16M8 5c0-1 1-1 1-2M12 5c0-1 1-1 1-2M16 5c0-1 1-1 1-2",
  cocina: "M4 10h16v7a3 3 0 01-3 3H7a3 3 0 01-3-3v-7zM2 10h20M9 6V4M15 6V4M12 7V3",
  cama:"M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6M3 18h18M3 18v2M21 18v2M7 10V7a1 1 0 011-1h3v4",
};

export default function Icono({ nombre, className = "h-6 w-6" }: { nombre: string; className?: string }) {
  const d = PATHS[nombre] ?? PATHS.cama;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

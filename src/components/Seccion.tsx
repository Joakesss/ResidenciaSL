export default function Seccion({
  id,
  titulo,
  bajada,
  fondo = "crema",
  children,
}: {
  id: string;
  titulo: string;
  bajada?: string;
  fondo?: "crema" | "arena" | "blanco";
  children: React.ReactNode;
}) {
  const fondos = { crema: "bg-crema", arena: "bg-arena", blanco: "bg-superficie" };
  return (
    <section id={id} className={`${fondos[fondo]} py-16 sm:py-24`}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl sm:text-4xl text-terracota-fuerte">{titulo}</h2>
        {bajada && <p className="mt-3 max-w-2xl text-tinta-suave">{bajada}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

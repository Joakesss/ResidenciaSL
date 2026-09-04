import Hero from "@/components/Hero";
import Servicios from "@/components/Servicios";
import Habitaciones from "@/components/Habitaciones";
import Galeria from "@/components/Galeria";

export default function Home() {
  return (
    <main>
      <Hero />
      <Servicios />
      <Habitaciones />
      <Galeria />
    </main>
  );
}

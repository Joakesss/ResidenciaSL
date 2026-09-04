import Hero from "@/components/Hero";
import Servicios from "@/components/Servicios";
import Habitaciones from "@/components/Habitaciones";
import Galeria from "@/components/Galeria";
import Equipamiento from "@/components/Equipamiento";
import Normas from "@/components/Normas";

export default function Home() {
  return (
    <main>
      <Hero />
      <Servicios />
      <Habitaciones />
      <Galeria />
      <Equipamiento />
      <Normas />
    </main>
  );
}

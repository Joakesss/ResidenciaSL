import Hero from "@/components/Hero";
import Servicios from "@/components/Servicios";
import Habitaciones from "@/components/Habitaciones";
import Galeria from "@/components/Galeria";
import Equipamiento from "@/components/Equipamiento";
import Normas from "@/components/Normas";
import Ubicacion from "@/components/Ubicacion";
import Faq from "@/components/Faq";
import Preinscripcion from "@/components/Preinscripcion";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Servicios />
        <Habitaciones />
        <Galeria />
        <Equipamiento />
        <Normas />
        <Ubicacion />
        <Faq />
        <Preinscripcion />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}

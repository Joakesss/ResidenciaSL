import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Preinscripcion from "./Preinscripcion";
import { contenido } from "@/content/residencia";

describe("Preinscripcion", () => {
  it("cuando hay formulario cargado, el CTA apunta a el y abre en pestana nueva", () => {
    render(<Preinscripcion />);
    if (contenido.preinscripcion.urlFormulario) {
      const cta = screen.getByRole("link", { name: /formulario|preinscrib/i });
      expect(cta).toHaveAttribute("href", contenido.preinscripcion.urlFormulario);
      expect(cta).toHaveAttribute("target", "_blank");
    }
  });

  it("cuando el formulario todavia no esta cargado, ofrece WhatsApp en vez de un link roto", () => {
    render(<Preinscripcion />);
    if (!contenido.preinscripcion.urlFormulario) {
      const cta = screen.getByRole("link", { name: /whatsapp/i });
      expect(cta.getAttribute("href")).toContain("wa.me");
      // Nunca un href vacio o "#": seria un CTA muerto en el punto de conversion
      expect(cta.getAttribute("href")).not.toBe("#");
    }
  });
});

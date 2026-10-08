import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Servicios from "./Servicios";
import { contenido } from "@/content/residencia";

const nombresDe = (estado: string) =>
  contenido.servicios.filter((s) => s.incluido === estado).map((s) => s.nombre);

const itemsDe = (titulo: RegExp) =>
  within(screen.getByRole("region", { name: titulo }))
    .getAllByRole("heading", { level: 4 })
    .map((h) => h.textContent);

describe("Servicios", () => {
  it("agrupa bajo Incluido solo los servicios confirmados", () => {
    render(<Servicios />);
    expect(itemsDe(/incluido en el alquiler/i)).toEqual(nombresDe("si"));
  });

  it("los servicios que se pagan aparte van en su propio grupo", () => {
    render(<Servicios />);
    expect(itemsDe(/se paga aparte/i)).toEqual(nombresDe("aparte"));
  });

  it("los servicios sin definir van en A confirmar, no en Incluido", () => {
    render(<Servicios />);
    const aConfirmar = nombresDe("a-confirmar");
    if (aConfirmar.length > 0) {
      expect(itemsDe(/a confirmar/i)).toEqual(aConfirmar);
    } else {
      expect(screen.queryByRole("region", { name: /a confirmar/i })).not.toBeInTheDocument();
    }
  });

  it("el texto visible no promete que luz, agua o gas esten incluidos", () => {
    const { container } = render(<Servicios />);
    const texto = (container.textContent ?? "").toLowerCase();
    for (const s of contenido.servicios) {
      if (s.incluido === "a-confirmar") {
        expect(texto).not.toContain(`${s.nombre.toLowerCase()} incluid`);
      }
    }
  });
});

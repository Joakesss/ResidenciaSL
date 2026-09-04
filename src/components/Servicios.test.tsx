import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Servicios from "./Servicios";
import { contenido } from "@/content/residencia";

describe("Servicios", () => {
  it("marca Incluido solo los servicios confirmados", () => {
    render(<Servicios />);
    const confirmados = contenido.servicios.filter((s) => s.incluido === "si").length;
    expect(screen.getAllByText("Incluido")).toHaveLength(confirmados);
  });

  it("los servicios sin definir muestran Consultar, no Incluido", () => {
    render(<Servicios />);
    const aConfirmar = contenido.servicios.filter((s) => s.incluido === "a-confirmar").length;
    if (aConfirmar > 0) {
      expect(screen.getAllByText("Consultar")).toHaveLength(aConfirmar);
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

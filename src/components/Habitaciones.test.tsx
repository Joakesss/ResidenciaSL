import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Habitaciones from "./Habitaciones";
import { contenido } from "@/content/residencia";

describe("Habitaciones", () => {
  it("renderiza una tarjeta por habitacion", () => {
    render(<Habitaciones />);
    expect(screen.getAllByRole("article")).toHaveLength(contenido.habitaciones.length);
  });

  it("muestra el badge de disponibilidad de cada habitacion", () => {
    render(<Habitaciones />);
    const disponibles = contenido.habitaciones.filter(
      (h) => h.disponibilidad === "disponible"
    ).length;
    expect(screen.getAllByText(/^Disponible$/i)).toHaveLength(disponibles);
  });

  it("aclara que la casa es de 4 personas — el dato que vuelve tolerable lo compartido", () => {
    render(<Habitaciones />);
    expect(screen.getByText(/4 personas/i)).toBeInTheDocument();
  });

  it("no muestra precios en ningun lado", () => {
    const { container } = render(<Habitaciones />);
    expect(container.textContent).not.toMatch(/\$\s?\d/);
  });
});

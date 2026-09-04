import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Nav from "./Nav";

describe("Nav", () => {
  it("muestra los links a cada seccion", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /habitaciones/i })).toHaveAttribute(
      "href", "#habitaciones"
    );
    expect(screen.getByRole("link", { name: /ubicaci/i })).toHaveAttribute(
      "href", "#ubicacion"
    );
  });

  it("el CTA principal lleva a preinscripcion", () => {
    render(<Nav />);
    const cta = screen.getByRole("link", { name: /preinscrib/i });
    expect(cta).toHaveAttribute("href", "#preinscripcion");
  });

  it("el menu mobile se abre y se cierra con el boton", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const boton = screen.getByRole("button", { name: /men/i });
    expect(boton).toHaveAttribute("aria-expanded", "false");
    await user.click(boton);
    expect(boton).toHaveAttribute("aria-expanded", "true");
    await user.click(boton);
    expect(boton).toHaveAttribute("aria-expanded", "false");
  });
});

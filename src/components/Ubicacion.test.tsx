import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Ubicacion from "./Ubicacion";
import { contenido } from "@/content/residencia";

describe("Ubicacion", () => {
  it("muestra la direccion de la residencia", () => {
    render(<Ubicacion />);
    expect(screen.getAllByText(/Estado de Israel 2185/i).length).toBeGreaterThan(0);
  });

  it("embebe el mapa sin API key", () => {
    const { container } = render(<Ubicacion />);
    const iframe = container.querySelector("iframe");
    expect(iframe).toBeTruthy();
    expect(iframe!.getAttribute("src")).toContain("output=embed");
    expect(iframe!.getAttribute("src")).not.toContain("key=");
  });

  it("el iframe tiene titulo accesible", () => {
    const { container } = render(<Ubicacion />);
    expect(container.querySelector("iframe")!.getAttribute("title")).toBeTruthy();
  });

  it("cada lugar cercano tiene su link Como llegar", () => {
    render(<Ubicacion />);
    const links = screen.getAllByRole("link", { name: /^c[oó]mo llegar$/i });
    expect(links).toHaveLength(contenido.lugaresCercanos.length);
    for (const l of links) {
      expect(l.getAttribute("href")).toContain("google.com/maps/dir/");
    }
  });

  it("NO inventa tiempos cuando la distancia no fue verificada", () => {
    const { container } = render(<Ubicacion />);
    const sinVerificar = contenido.lugaresCercanos.every((l) => l.minutosCaminando === null);
    if (sinVerificar) {
      expect(container.textContent).not.toMatch(/\d+\s*min/i);
    }
  });
});

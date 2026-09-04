import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Galeria from "./Galeria";
import { contenido } from "@/content/residencia";

describe("Galeria", () => {
  it("renderiza una miniatura por item", () => {
    render(<Galeria />);
    expect(screen.getAllByRole("button", { name: /ampliar/i })).toHaveLength(
      contenido.galeria.length
    );
  });

  it("toda imagen tiene alt descriptivo", () => {
    render(<Galeria />);
    for (const img of screen.getAllByRole("img")) {
      expect(img.getAttribute("alt")?.length ?? 0).toBeGreaterThan(3);
    }
  });

  it("al clickear una miniatura abre el lightbox", async () => {
    const user = userEvent.setup();
    render(<Galeria />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: /ampliar/i })[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("el lightbox se cierra con Escape", async () => {
    const user = userEvent.setup();
    render(<Galeria />);
    await user.click(screen.getAllByRole("button", { name: /ampliar/i })[0]);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("se puede navegar a la siguiente imagen", async () => {
    const user = userEvent.setup();
    render(<Galeria />);
    await user.click(screen.getAllByRole("button", { name: /ampliar/i })[0]);
    await user.click(screen.getByRole("button", { name: /siguiente/i }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent(contenido.galeria[1].alt);
  });
});

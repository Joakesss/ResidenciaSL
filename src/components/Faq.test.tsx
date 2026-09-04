import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Faq from "./Faq";
import { contenido } from "@/content/residencia";

describe("Faq", () => {
  it("renderiza todas las preguntas", () => {
    render(<Faq />);
    expect(screen.getAllByRole("button")).toHaveLength(contenido.faq.length);
  });

  it("las respuestas arrancan cerradas y se abren al clickear", async () => {
    const user = userEvent.setup();
    render(<Faq />);
    const primera = screen.getAllByRole("button")[0];
    expect(primera).toHaveAttribute("aria-expanded", "false");
    await user.click(primera);
    expect(primera).toHaveAttribute("aria-expanded", "true");
  });
});

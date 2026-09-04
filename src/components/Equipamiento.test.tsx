import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Equipamiento from "./Equipamiento";

describe("Equipamiento", () => {
  it("separa lo propio de lo compartido", () => {
    render(<Equipamiento />);
    expect(screen.getByRole("heading", { name: /en tu habitaci/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /espacios compartidos/i })).toBeInTheDocument();
  });

  it("aclara entre cuantas personas se comparte", () => {
    render(<Equipamiento />);
    expect(screen.getByText(/4 personas/i)).toBeInTheDocument();
  });

  it("muestra el lavarropas", () => {
    render(<Equipamiento />);
    expect(screen.getByText(/lavarropas/i)).toBeInTheDocument();
  });
});

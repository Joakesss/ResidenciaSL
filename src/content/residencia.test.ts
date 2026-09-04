import { describe, it, expect } from "vitest";
import { contenido } from "./residencia";
import { linkWhatsapp } from "@/lib/links";

describe("contenido de la residencia", () => {
  it("tiene 3 habitaciones que suman 4 plazas", () => {
    expect(contenido.habitaciones).toHaveLength(3);
    const plazas = contenido.habitaciones.reduce((t, h) => t + h.capacidad, 0);
    expect(plazas).toBe(4);
  });

  it("declara los cuatro servicios incluidos", () => {
    const ids = contenido.servicios.map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(["internet", "luz", "agua", "gas"]));
  });

  it("destaca la limpieza de espacios comunes como servicio", () => {
    const limpieza = contenido.servicios.find((s) => s.id === "limpieza");
    expect(limpieza).toBeDefined();
    expect(limpieza!.destacado).toBe(true);
  });

  it("no publica ningun mail — el contacto es solo WhatsApp y formulario", () => {
    const json = JSON.stringify(contenido);
    expect(json).not.toMatch(/mailto:/);
    expect(json).not.toMatch(/[\w.]+@[\w.]+\.\w+/);
  });

  it("no publica precios", () => {
    const json = JSON.stringify(contenido);
    expect(json).not.toMatch(/\$\s?\d/);
  });

  it("el telefono arma un link de WhatsApp valido", () => {
    expect(linkWhatsapp(contenido.contacto.whatsapp)).toBe(
      "https://wa.me/5492664503103"
    );
  });

  it("todo lugar cercano tiene direccion para calcular la ruta", () => {
    for (const lugar of contenido.lugaresCercanos) {
      expect(lugar.direccion.length).toBeGreaterThan(0);
    }
  });

  it("las distancias no verificadas son null, nunca un numero inventado", () => {
    for (const lugar of contenido.lugaresCercanos) {
      const m = lugar.minutosCaminando;
      expect(m === null || (typeof m === "number" && m > 0)).toBe(true);
    }
  });

  it("toda habitacion apunta a una imagen dentro de /img", () => {
    for (const h of contenido.habitaciones) {
      expect(h.imagen).toMatch(/^\/img\/.+\.(jpg|png|webp|svg)$/);
    }
  });

  it("no menciona el colchon mientras siga abierta PREGUNTA(colchon)", () => {
    const json = JSON.stringify(contenido).toLowerCase();
    expect(json).not.toContain("colchon");
    expect(json).not.toContain("colchón");
  });
});

import { describe, it, expect } from "vitest";
import {
  normalizarTelefonoAr,
  linkWhatsapp,
  linkMapaEmbed,
  linkComoLlegar,
} from "./links";

describe("normalizarTelefonoAr", () => {
  it("deja pasar un numero local ya limpio", () => {
    expect(normalizarTelefonoAr("2664503103")).toBe("2664503103");
  });

  it("saca espacios, guiones y parentesis", () => {
    expect(normalizarTelefonoAr("(266) 450-3103")).toBe("2664503103");
  });

  it("no duplica el codigo de pais si ya viene con +54 9", () => {
    expect(normalizarTelefonoAr("+54 9 266 450 3103")).toBe("2664503103");
  });

  it("no duplica el codigo de pais si viene con 54 sin el 9", () => {
    expect(normalizarTelefonoAr("542664503103")).toBe("2664503103");
  });

  it("saca el 0 inicial de la caracteristica", () => {
    expect(normalizarTelefonoAr("02664503103")).toBe("2664503103");
  });
});

describe("linkWhatsapp", () => {
  it("arma el link con el prefijo 549 de movil argentino", () => {
    expect(linkWhatsapp("2664503103")).toBe("https://wa.me/5492664503103");
  });

  it("no duplica el prefijo si el numero ya lo trae", () => {
    expect(linkWhatsapp("+5492664503103")).toBe("https://wa.me/5492664503103");
  });

  it("agrega el mensaje prellenado codificado", () => {
    const url = linkWhatsapp("2664503103", "Hola! Quiero consultar por una habitacion");
    expect(url).toContain("https://wa.me/5492664503103?text=");
    expect(url).toContain("Quiero%20consultar");
  });

  it("codifica los acentos del mensaje sin romper la url", () => {
    const url = linkWhatsapp("2664503103", "¿Está disponible?");
    expect(url).not.toContain(" ");
    expect(decodeURIComponent(url.split("?text=")[1])).toBe("¿Está disponible?");
  });
});

describe("linkMapaEmbed", () => {
  it("arma un embed sin API key", () => {
    const url = linkMapaEmbed("Estado de Israel 2185, San Luis, Argentina");
    expect(url).toContain("output=embed");
    expect(url).not.toContain("key=");
    expect(url).toContain("Estado%20de%20Israel%202185");
  });
});

describe("linkComoLlegar", () => {
  it("arma una ruta con origen y destino", () => {
    const url = linkComoLlegar(
      "Estado de Israel 2185, San Luis, Argentina",
      "Universidad Nacional de San Luis"
    );
    expect(url).toContain("google.com/maps/dir/");
    expect(url).toContain("api=1");
    expect(url).toContain("origin=");
    expect(url).toContain("destination=");
  });

  it("no pierde el destino cuando tiene comas y acentos", () => {
    const url = linkComoLlegar("A, 1", "Terminal de Ómnibus, San Luis");
    const destino = new URL(url).searchParams.get("destination");
    expect(destino).toBe("Terminal de Ómnibus, San Luis");
  });
});

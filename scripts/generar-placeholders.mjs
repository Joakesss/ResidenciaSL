/**
 * Genera placeholders locales, uno por cada imagen que el contenido espera.
 * Local a proposito: un servicio externo tipo placeholder.com es una
 * dependencia que algun dia responde 404 y rompe el sitio en produccion.
 *
 * Para reemplazar por fotos reales: poner el .jpg en public/img/ y cambiar
 * la extension .svg -> .jpg en src/content/residencia.ts.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

const DESTINO = "public/img";

const IMAGENES = [
  ["fachada", "Frente de la residencia"],
  ["living", "Espacio comun"],
  ["cocina", "Cocina compartida"],
  ["bano", "Bano compartido"],
  ["habitacion-privada-1", "Habitacion privada 1"],
  ["habitacion-privada-2", "Habitacion privada 2"],
  ["habitacion-compartida", "Habitacion compartida"],
  ["patio", "Patio"],
  ["og-image", "Residencia Estudiantil San Luis"],
];

const svg = (texto) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <rect width="1200" height="800" fill="#f2e9de"/>
  <rect x="20" y="20" width="1160" height="760" fill="none" stroke="#b5623c" stroke-width="3" stroke-dasharray="14 10"/>
  <text x="600" y="380" font-family="Georgia, serif" font-size="46" fill="#8f4a2c" text-anchor="middle">${texto}</text>
  <text x="600" y="440" font-family="system-ui, sans-serif" font-size="26" fill="#5c534a" text-anchor="middle">FOTO PENDIENTE</text>
</svg>`;

mkdirSync(DESTINO, { recursive: true });

for (const [nombre, texto] of IMAGENES) {
  if (nombre === "og-image") continue;
  writeFileSync(`${DESTINO}/${nombre}.svg`, svg(texto));
  console.log(`  ${DESTINO}/${nombre}.svg`);
}

/**
 * og-image va en PNG, no en SVG: WhatsApp, Facebook y Twitter NO renderizan
 * SVG en las tarjetas de preview. Como el sitio se va a compartir sobre todo
 * por WhatsApp, un SVG aca significa link sin imagen — justo donde mas importa.
 */
await sharp(Buffer.from(svg("Residencia Estudiantil San Luis")))
  .png()
  .toFile(`${DESTINO}/og-image.png`);
console.log(`  ${DESTINO}/og-image.png (PNG: las previews de WhatsApp no leen SVG)`);

console.log(`\n${IMAGENES.length} placeholders generados.`);

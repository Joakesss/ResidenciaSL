/**
 * Construccion de URLs externas. Funciones puras, sin dependencias.
 *
 * Ninguna requiere API key: los mapas usan el embed publico de Google Maps
 * en vez de la Maps Embed API, para no depender de una cuenta de Google Cloud
 * ni de una cuota que pueda agotarse en produccion.
 */

/** Prefijo de movil argentino que espera wa.me: 54 (pais) + 9 (movil). */
const PREFIJO_MOVIL_AR = "549";

/**
 * Reduce un telefono argentino a caracteristica + numero, sin codigo de pais
 * ni 0 inicial. Acepta las formas en que la gente escribe un telefono.
 *
 * Limitacion conocida: no remueve el 15 historico (ej. "266 15 450-3103"),
 * porque el 15 va despues de la caracteristica y sacarlo a ciegas romperia
 * numeros validos. Cargar el numero sin 15 en el contenido.
 */
export function normalizarTelefonoAr(tel: string): string {
  let digitos = tel.replace(/\D/g, "");

  if (digitos.startsWith(PREFIJO_MOVIL_AR)) {
    digitos = digitos.slice(PREFIJO_MOVIL_AR.length);
  } else if (digitos.startsWith("54")) {
    digitos = digitos.slice(2);
  }

  if (digitos.startsWith("0")) {
    digitos = digitos.slice(1);
  }

  return digitos;
}

/** Link de chat de WhatsApp, con mensaje prellenado opcional. */
export function linkWhatsapp(telefono: string, mensaje?: string): string {
  const numero = PREFIJO_MOVIL_AR + normalizarTelefonoAr(telefono);
  const base = `https://wa.me/${numero}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

/** URL para el iframe del mapa. Publica, sin API key. */
export function linkMapaEmbed(direccion: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed`;
}

/**
 * URL de indicaciones de Google Maps. En celular abre la app nativa,
 * asi que las distancias y tiempos los calcula Google y siempre son reales.
 */
export function linkComoLlegar(origen: string, destino: string): string {
  const params = new URLSearchParams({
    api: "1",
    origin: origen,
    destination: destino,
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

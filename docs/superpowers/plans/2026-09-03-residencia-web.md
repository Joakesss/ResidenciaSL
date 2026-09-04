# Web Residencia Estudiantil — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sitio estático de una página que promociona una residencia estudiantil en San Luis y conduce a un formulario de preinscripción y a WhatsApp.

**Architecture:** Next.js 15 App Router con `output: 'export'` → HTML estático sin servidor. Todo el contenido editable vive en un único módulo (`src/content/residencia.ts`); los componentes sólo lo leen. La lógica que puede romperse de verdad (construcción de links de WhatsApp y Google Maps, validación del contenido) vive en `src/lib/` y se desarrolla con TDD. Los componentes son presentacionales y se verifican con smoke tests de comportamiento, no con snapshots.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Vitest + Testing Library + jsdom.

## Global Constraints

- **Idioma:** todo el contenido de cara al usuario en **español rioplatense** (voseo: "consultá", "escribinos", "vení"). Nunca "consulta" / "escríbenos".
- **Sin nombre propio.** El sitio se presenta como "Residencia Estudiantil en San Luis". El nombre vive en `contenido.sitio.nombre` para poder cambiarlo en un solo lugar.
- **Sin mail.** El contacto es exclusivamente WhatsApp y el formulario. No agregar `mailto:` en ninguna parte.
- **Sin precios.** En toda referencia a valores se usa "Consultá los valores por WhatsApp".
- **Dirección:** `Estado de Israel 2185, San Luis, Argentina`
- **WhatsApp:** `2664503103` → `https://wa.me/5492664503103`
- **Habitaciones:** 2 privadas individuales + 1 compartida para 2 personas. **4 personas en total** en la casa.
- **Servicios incluidos:** internet, luz, agua, gas.
- **Baño:** compartido, **uno solo para las 4 personas**. **Cocina:** compartida. **Lavarropas:** sí.
- **Limpieza:** espacios comunes a cargo de la residencia (persona contratada); cada residente limpia su habitación. **Se comunica como diferencial, destacado en Servicios** — no enterrado en Normas.
- **Amoblado:** sí. **No mencionar colchón** hasta que se resuelva `PREGUNTA(colchon)`.
- **Sin API keys.** El mapa es un iframe `output=embed`. Ninguna dependencia de Google Cloud.
- **Sin servicios externos de imágenes.** Todo placeholder es un archivo local en `public/`.
- **Distancias no verificadas no se muestran.** `minutosCaminando: null` ⇒ el componente omite el dato. Prohibido inventar tiempos.
- **Marcador de dudas:** un único token `PREGUNTA(tema):` en comentarios. Recuperable con `grep -rn "PREGUNTA(" src/`.
- **Accesibilidad:** contraste mínimo WCAG AA (4.5:1 en texto normal). Todo `<img>` con `alt` descriptivo. Todo control interactivo alcanzable por teclado.

---

## File Structure

| Archivo | Responsabilidad |
|---|---|
| `src/content/residencia.ts` | **Único** lugar con datos y textos editables. Sin JSX. |
| `src/content/tipos.ts` | Tipos del contenido. Sin datos. |
| `src/lib/links.ts` | Construcción de URLs (WhatsApp, Maps embed, Maps directions). Funciones puras. |
| `src/lib/links.test.ts` | Tests de `links.ts`. |
| `src/content/residencia.test.ts` | Validación de invariantes del contenido. |
| `src/app/layout.tsx` | Shell HTML, fuentes, metadata SEO, Open Graph, JSON-LD. |
| `src/app/page.tsx` | Compone las secciones en orden. Sin lógica. |
| `src/app/globals.css` | Tokens de diseño Tailwind v4 (`@theme`) y estilos base. |
| `src/components/*.tsx` | Una sección por archivo. Presentacionales. |
| `public/img/` | Placeholders locales, con el nombre del archivo final. |
| `README.md` | Instrucciones para alguien **no técnico**. |

---

## Task 1: Scaffold del proyecto

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `vitest.config.ts`, `postcss.config.mjs`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

**Interfaces:**
- Consumes: nada
- Produces: proyecto que compila con `npm run build` y corre tests con `npm test`

- [ ] **Step 1: Inicializar el proyecto**

```bash
npm init -y
npm install next@15 react@19 react-dom@19
npm install -D typescript @types/node @types/react @types/react-dom \
  tailwindcss @tailwindcss/postcss postcss sharp \
  vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: `package.json` — scripts**

Reemplazar el bloque `"scripts"` por:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "npx serve out",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export estatico: genera HTML plano en out/. Sin servidor, deploy gratis.
  output: "export",
  // Obligatorio con output:export — no hay servidor que optimice imagenes.
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
```

- [ ] **Step 4: `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "out"]
}
```

- [ ] **Step 5: `postcss.config.mjs`**

```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

- [ ] **Step 6: `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

- [ ] **Step 7: `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 8: `.gitignore`**

```
node_modules/
.next/
out/
next-env.d.ts
*.tsbuildinfo
.DS_Store
.env*.local
```

- [ ] **Step 9: `src/app/globals.css` — tokens de diseño**

Paleta cálida y hogareña. Los tonos oscuros son los que llevan texto blanco encima;
los claros son fondos. Esta separación es lo que sostiene el contraste WCAG AA.

```css
@import "tailwindcss";

@theme {
  /* Fondos */
  --color-crema: #fbf7f2;
  --color-superficie: #ffffff;
  --color-arena: #f2e9de;

  /* Texto */
  --color-tinta: #2e2a26;
  --color-tinta-suave: #5c534a;

  /* Terracota: -fuerte lleva texto blanco, -claro es fondo */
  --color-terracota: #b5623c;
  --color-terracota-fuerte: #8f4a2c;
  --color-terracota-claro: #f7e8e0;

  /* Verde: acento de confirmacion / disponibilidad */
  --color-verde: #4f6b44;
  --color-verde-claro: #e8efe4;

  --color-borde: #e5dcd1;

  --font-display: "Fraunces", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
  /* Compensa el nav fijo al saltar a una seccion con ancla */
  scroll-padding-top: 5rem;
}

body {
  background-color: var(--color-crema);
  color: var(--color-tinta);
  font-family: var(--font-sans);
}

/* Respeta a quien pidio menos movimiento en su sistema operativo */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 10: `src/app/layout.tsx` provisorio**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Residencia Estudiantil en San Luis" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 11: `src/app/page.tsx` provisorio**

```tsx
export default function Home() {
  return <main className="p-8">Residencia Estudiantil en San Luis</main>;
}
```

- [ ] **Step 12: Verificar que compila**

Run: `npm run build`
Expected: build exitoso, se crea el directorio `out/` con `index.html`.

- [ ] **Step 13: Verificar que el runner de tests arranca**

Run: `npm test`
Expected: "No test files found" — sin errores de configuración.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js estatico con Tailwind v4 y Vitest"
```

---

## Task 2: Links de WhatsApp y Google Maps (TDD)

Es la única lógica del sitio que puede estar mal de forma silenciosa: un link de
WhatsApp con el prefijo mal armado no da error, simplemente no abre el chat de
nadie — y nadie se entera hasta que se pierde un interesado.

**Files:**
- Create: `src/lib/links.ts`
- Test: `src/lib/links.test.ts`

**Interfaces:**
- Consumes: nada
- Produces:
  - `normalizarTelefonoAr(tel: string): string`
  - `linkWhatsapp(telefono: string, mensaje?: string): string`
  - `linkMapaEmbed(direccion: string): string`
  - `linkComoLlegar(origen: string, destino: string): string`

- [ ] **Step 1: Escribir los tests que fallan**

`src/lib/links.test.ts`:

```ts
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
```

- [ ] **Step 2: Correr los tests para verificar que fallan**

Run: `npm test`
Expected: FAIL — "Failed to resolve import ./links".

- [ ] **Step 3: Implementar `src/lib/links.ts`**

```ts
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
```

- [ ] **Step 4: Correr los tests para verificar que pasan**

Run: `npm test`
Expected: PASS — 11 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/links.ts src/lib/links.test.ts
git commit -m "feat: construccion de links de WhatsApp y Google Maps sin API key"
```

---

## Task 3: Modelo y contenido

El archivo que define si esto se puede mantener o no. Es el único lugar donde
alguien tiene que entrar para cambiar un teléfono, marcar una habitación como
ocupada o corregir una norma.

**Files:**
- Create: `src/content/tipos.ts`, `src/content/residencia.ts`
- Test: `src/content/residencia.test.ts`

**Interfaces:**
- Consumes: nada
- Produces: `contenido` (objeto default export nombrado `contenido`), y los tipos
  `Disponibilidad`, `Habitacion`, `Servicio`, `ItemEquipamiento`, `Norma`,
  `LugarCercano`, `PreguntaFrecuente`, `Contenido`.

- [ ] **Step 1: Escribir los tests que fallan**

`src/content/residencia.test.ts`:

```ts
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
      expect(h.imagen).toMatch(/^\/img\/.+\.(jpg|png|webp)$/);
    }
  });

  it("no menciona el colchon mientras siga abierta PREGUNTA(colchon)", () => {
    expect(JSON.stringify(contenido).toLowerCase()).not.toContain("colchon");
    expect(JSON.stringify(contenido).toLowerCase()).not.toContain("colchón");
  });
});
```

- [ ] **Step 2: Correr los tests para verificar que fallan**

Run: `npm test`
Expected: FAIL — no existe `./residencia`.

- [ ] **Step 3: Crear `src/content/tipos.ts`**

```ts
export type Disponibilidad = "disponible" | "ocupada" | "consultar";

export interface Habitacion {
  id: string;
  nombre: string;
  descripcion: string;
  /** Cuantas personas duermen en esta habitacion. */
  capacidad: number;
  disponibilidad: Disponibilidad;
  /** Ruta publica, ej. "/img/habitacion-privada-1.jpg". */
  imagen: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  detalle: string;
  /** Icono inline por nombre; lo resuelve el componente Servicios. */
  icono: string;
  /** true = se muestra mas grande. Reservado para diferenciales reales. */
  destacado: boolean;
}

export interface ItemEquipamiento {
  id: string;
  nombre: string;
  /** "propio" = de uso exclusivo; "compartido" = de uso comun. */
  uso: "propio" | "compartido";
}

export interface Norma {
  id: string;
  titulo: string;
  detalle: string;
}

export interface LugarCercano {
  id: string;
  nombre: string;
  categoria: "universidad" | "transporte" | "comercio" | "ciudad";
  /** Direccion o nombre que Google Maps pueda resolver. */
  direccion: string;
  descripcion: string;
  /**
   * null = NO verificado. El componente omite el dato.
   * Nunca poner un numero estimado: una distancia falsa se descubre
   * el primer dia y arruina la confianza de quien ya se mudo.
   */
  minutosCaminando: number | null;
}

export interface PreguntaFrecuente {
  id: string;
  pregunta: string;
  respuesta: string;
}

export interface MediaGaleria {
  id: string;
  tipo: "imagen" | "video";
  src: string;
  /** Texto alternativo. Obligatorio: es lo que lee un lector de pantalla. */
  alt: string;
  /** Poster del video. Solo para tipo "video". */
  poster?: string;
}

export interface Contenido {
  sitio: {
    nombre: string;
    tagline: string;
    descripcion: string;
    url: string;
  };
  contacto: {
    whatsapp: string;
    whatsappMostrado: string;
    direccion: string;
    localidad: string;
  };
  preinscripcion: {
    urlFormulario: string;
    titulo: string;
    texto: string;
  };
  servicios: Servicio[];
  habitaciones: Habitacion[];
  galeria: MediaGaleria[];
  equipamiento: ItemEquipamiento[];
  normas: Norma[];
  lugaresCercanos: LugarCercano[];
  faq: PreguntaFrecuente[];
}
```

- [ ] **Step 4: Crear `src/content/residencia.ts`**

```ts
import type { Contenido } from "./tipos";

/**
 * ============================================================
 *  CONTENIDO EDITABLE DE LA WEB
 * ============================================================
 * Todo lo que se lee en el sitio esta en este archivo.
 * Para cambiar un telefono, marcar una habitacion como ocupada
 * o corregir una norma, se edita aca y nada mas.
 *
 * Ver README.md para instrucciones paso a paso.
 *
 * PREGUNTA(nombre): la residencia todavia no tiene nombre propio.
 *   Cuando lo tenga, se cambia unicamente sitio.nombre.
 */

export const contenido: Contenido = {
  sitio: {
    nombre: "Residencia Estudiantil en San Luis",
    tagline: "Tu lugar para estudiar, descansar y sentirte en casa",
    descripcion:
      "Residencia estudiantil en San Luis capital con habitaciones privadas e individuales y habitacion compartida. Internet, luz, agua y gas incluidos. A pasos de la vida universitaria.",
    // PREGUNTA(dominio): definir el dominio final antes de publicar.
    // Afecta los links absolutos de Open Graph y el JSON-LD.
    url: "https://residencia-san-luis.example",
  },

  contacto: {
    whatsapp: "2664503103",
    whatsappMostrado: "266 450-3103",
    direccion: "Estado de Israel 2185, San Luis, Argentina",
    localidad: "San Luis Capital",
  },

  preinscripcion: {
    // PREGUNTA(formulario): falta el link del Google Form.
    //   EL SITIO NO SE PUBLICA SIN ESTO: es el objetivo de conversion.
    //   Reemplazar por la URL real del formulario.
    urlFormulario: "",
    titulo: "Reserva tu lugar",
    texto:
      "Completá el formulario de preinscripción y nos ponemos en contacto con vos para coordinar una visita y contarte los valores. No te compromete a nada.",
  },

  servicios: [
    {
      id: "internet",
      nombre: "Internet incluido",
      detalle: "Wifi en toda la casa, para cursar y rendir sin sobresaltos.",
      icono: "wifi",
      destacado: true,
    },
    {
      id: "limpieza",
      nombre: "Limpieza de espacios comunes",
      detalle:
        "Una persona se ocupa de la cocina, el baño y los espacios comunes. Vos solo te ocupás de tu habitación.",
      icono: "escoba",
      destacado: true,
    },
    {
      id: "luz",
      nombre: "Luz incluida",
      detalle: "Sin factura aparte ni sorpresas a fin de mes.",
      icono: "luz",
      destacado: false,
    },
    {
      id: "agua",
      nombre: "Agua incluida",
      detalle: "Servicio de agua incluido en el alquiler.",
      icono: "agua",
      destacado: false,
    },
    {
      id: "gas",
      nombre: "Gas incluido",
      detalle: "Para cocinar y para el agua caliente, sin costo extra.",
      icono: "gas",
      destacado: false,
    },
    {
      id: "amoblado",
      nombre: "Habitaciones amobladas",
      detalle: "Vienen amobladas: llegás y te instalás.",
      icono: "cama",
      destacado: false,
    },
  ],

  habitaciones: [
    {
      id: "privada-1",
      nombre: "Habitación privada individual",
      descripcion:
        "Habitación individual para una persona, amoblada. Tu propio espacio para estudiar y descansar.",
      capacidad: 1,
      disponibilidad: "disponible",
      imagen: "/img/habitacion-privada-1.jpg",
    },
    {
      id: "privada-2",
      nombre: "Habitación privada individual",
      descripcion:
        "Segunda habitación individual, amoblada, con las mismas comodidades.",
      capacidad: 1,
      disponibilidad: "disponible",
      imagen: "/img/habitacion-privada-2.jpg",
    },
    {
      id: "compartida",
      nombre: "Habitación compartida",
      descripcion:
        "Para dos personas, amoblada. Ideal si venís con un amigo o una amiga, o si preferís una opción más económica.",
      capacidad: 2,
      disponibilidad: "disponible",
      imagen: "/img/habitacion-compartida.jpg",
    },
  ],

  // PREGUNTA(fotos): son placeholders. Reemplazar los archivos en public/img/
  //   manteniendo el mismo nombre; no hace falta tocar este archivo.
  galeria: [
    { id: "fachada", tipo: "imagen", src: "/img/fachada.jpg", alt: "Frente de la residencia" },
    { id: "living", tipo: "imagen", src: "/img/living.jpg", alt: "Espacio común para estar y estudiar" },
    { id: "cocina", tipo: "imagen", src: "/img/cocina.jpg", alt: "Cocina compartida equipada" },
    { id: "bano", tipo: "imagen", src: "/img/bano.jpg", alt: "Baño compartido" },
    { id: "privada-1", tipo: "imagen", src: "/img/habitacion-privada-1.jpg", alt: "Habitación privada individual" },
    { id: "privada-2", tipo: "imagen", src: "/img/habitacion-privada-2.jpg", alt: "Segunda habitación privada individual" },
    { id: "compartida", tipo: "imagen", src: "/img/habitacion-compartida.jpg", alt: "Habitación compartida para dos personas" },
    { id: "patio", tipo: "imagen", src: "/img/patio.jpg", alt: "Patio de la residencia" },
  ],

  equipamiento: [
    { id: "cocina", nombre: "Cocina equipada", uso: "compartido" },
    { id: "heladera", nombre: "Heladera", uso: "compartido" },
    { id: "lavarropas", nombre: "Lavarropas", uso: "compartido" },
    { id: "bano", nombre: "Baño completo", uso: "compartido" },
    { id: "living", nombre: "Espacio común de estar", uso: "compartido" },
    { id: "patio", nombre: "Patio", uso: "compartido" },
    { id: "wifi", nombre: "Wifi en toda la casa", uso: "compartido" },
    { id: "cama", nombre: "Cama", uso: "propio" },
    { id: "escritorio", nombre: "Escritorio para estudiar", uso: "propio" },
    { id: "placard", nombre: "Placard", uso: "propio" },
  ],

  // PREGUNTA(normas): BORRADOR. Redactado como propuesta, no es el reglamento
  //   real. Tiene que revisarlo y aprobarlo la familia antes de publicar.
  // PREGUNTA(visitas): confirmar la politica real de visitas.
  normas: [
    {
      id: "convivencia",
      titulo: "Respeto y buena convivencia",
      detalle:
        "Somos pocos y eso es una ventaja: alcanza con el respeto de todos los días para que la casa funcione bien.",
    },
    {
      id: "descanso",
      titulo: "Horarios de descanso",
      detalle:
        "Silencio a partir de las 23 h. En época de parciales y finales, todos agradecen poder dormir y estudiar tranquilos.",
    },
    {
      id: "espacios",
      titulo: "Los espacios comunes se dejan como se encontraron",
      detalle:
        "La limpieza profunda la hacemos nosotros. Solo pedimos que cada uno levante lo suyo después de usar la cocina.",
    },
    {
      id: "habitacion",
      titulo: "Cada uno cuida su habitación",
      detalle: "La limpieza de la habitación propia queda a cargo de quien la ocupa.",
    },
    {
      id: "visitas",
      titulo: "Visitas",
      detalle:
        "Se pueden recibir visitas avisando con anticipación y respetando los horarios de descanso.",
    },
    {
      id: "sustancias",
      titulo: "No se fuma dentro de la casa",
      detalle: "Por la salud y la comodidad de todos, no se fuma en espacios cerrados.",
    },
  ],

  // PREGUNTA(distancias): minutosCaminando en null = sin verificar.
  //   Medir la distancia real desde Estado de Israel 2185 y completar.
  //   Mientras sea null, el sitio no muestra ningun tiempo — a proposito.
  lugaresCercanos: [
    {
      id: "unsl",
      nombre: "UNSL — Campus Universitario",
      categoria: "universidad",
      direccion: "Universidad Nacional de San Luis, Av. Ejército de los Andes 950, San Luis",
      descripcion: "Facultades y campus de la Universidad Nacional de San Luis.",
      minutosCaminando: null,
    },
    {
      id: "terminal",
      nombre: "Terminal de Ómnibus",
      categoria: "transporte",
      direccion: "Terminal de Ómnibus de San Luis, San Luis, Argentina",
      descripcion: "Para viajar a tu ciudad los fines de semana.",
      minutosCaminando: null,
    },
    {
      id: "supermercado",
      nombre: "Supermercados y comercios",
      categoria: "comercio",
      direccion: "supermercados cerca de Estado de Israel 2185, San Luis",
      descripcion: "Super, farmacia y comercios para el día a día.",
      minutosCaminando: null,
    },
    {
      id: "centro",
      nombre: "Centro y Plaza Pringles",
      categoria: "ciudad",
      direccion: "Plaza Pringles, San Luis, Argentina",
      descripcion: "El centro de la ciudad, bancos, cafés y transporte.",
      minutosCaminando: null,
    },
  ],

  // PREGUNTA(deposito): confirmar si se pide deposito, garantia o mes adelantado.
  // PREGUNTA(contrato): confirmar plazo minimo de estadia.
  // PREGUNTA(lavarropas-uso): confirmar si el uso del lavarropas esta incluido.
  faq: [
    {
      id: "incluye",
      pregunta: "¿Qué incluye el alquiler?",
      respuesta:
        "Internet, luz, agua y gas están incluidos. También la limpieza de los espacios comunes. La habitación viene amoblada.",
    },
    {
      id: "bano",
      pregunta: "¿El baño es compartido?",
      respuesta:
        "Sí, el baño es compartido, pero entre 4 personas en total. No es una pensión grande: somos pocos y eso hace toda la diferencia en el día a día.",
    },
    {
      id: "cocina",
      pregunta: "¿Puedo cocinar?",
      respuesta:
        "Sí. La cocina es compartida y está equipada, con heladera. También hay lavarropas.",
    },
    {
      id: "precio",
      pregunta: "¿Cuánto sale?",
      respuesta:
        "Consultanos por WhatsApp y te pasamos los valores actualizados según la habitación que te interese.",
    },
    {
      id: "visita",
      pregunta: "¿Puedo ir a conocer la residencia antes de decidir?",
      respuesta:
        "Por supuesto, y te lo recomendamos. Escribinos por WhatsApp y coordinamos un día para que la veas.",
    },
    {
      id: "preinscripcion",
      pregunta: "¿La preinscripción me compromete a algo?",
      respuesta:
        "No. Es solo para que nos dejes tus datos y podamos contactarte. No implica ningún pago ni obligación.",
    },
  ],
};
```

- [ ] **Step 5: Correr los tests para verificar que pasan**

Run: `npm test`
Expected: PASS — los 10 tests de contenido más los 11 de links.

- [ ] **Step 6: Verificar que las dudas quedaron registradas**

Run: `grep -rn "PREGUNTA(" src/`
Expected: al menos 9 marcadores (nombre, dominio, formulario, fotos, normas, visitas, distancias, deposito, contrato, lavarropas-uso).

- [ ] **Step 7: Commit**

```bash
git add src/content/
git commit -m "feat: modelo de contenido centralizado con dudas marcadas"
```

---

## Task 4: Placeholders locales

**Files:**
- Create: `public/img/*.svg` → renombrados a `.jpg`, `scripts/generar-placeholders.mjs`

**Interfaces:**
- Consumes: `contenido.galeria`, `contenido.habitaciones` (para saber qué archivos hacen falta)
- Produces: los archivos de imagen que referencian esos módulos

- [ ] **Step 1: Escribir el generador**

`scripts/generar-placeholders.mjs`:

```js
/**
 * Genera placeholders locales, uno por cada imagen que el contenido espera.
 * Local a proposito: un servicio externo tipo placeholder.com es una
 * dependencia que algun dia responde 404 y rompe el sitio en produccion.
 *
 * Para reemplazar por fotos reales: sobrescribir el archivo con el mismo
 * nombre en public/img/. No hace falta tocar codigo.
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
```

- [ ] **Step 2: Generar los placeholders**

Run: `node scripts/generar-placeholders.mjs`
Expected: 8 archivos `.svg` + `og-image.png` en `public/img/`.

Verificar que el PNG es un PNG real:

```bash
file public/img/og-image.png
```
Expected: `PNG image data, 1200 x 800`.

- [ ] **Step 3: Ajustar las extensiones en el contenido**

Los placeholders son `.svg` pero las fotos reales van a ser `.jpg`. Para que
reemplazar una foto no exija tocar código, el contenido apunta a `.jpg` desde
el principio y se copia cada `.svg` a `.jpg` (un SVG con extensión `.jpg` no
lo sirve bien el navegador, así que **no** se hace eso).

Decisión: el contenido apunta a `.svg` mientras sean placeholders. El README
explica que al cargar fotos reales hay que cambiar la extensión a `.jpg` en
`residencia.ts`. Es un solo find-and-replace y queda documentado.

Actualizar en `src/content/residencia.ts` todas las rutas `/img/*.jpg` → `/img/*.svg`,
y en `src/content/residencia.test.ts` el regex a:

```ts
expect(h.imagen).toMatch(/^\/img\/.+\.(jpg|png|webp|svg)$/);
```

- [ ] **Step 4: Correr los tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/ public/img/ src/content/
git commit -m "feat: placeholders locales generados, sin dependencias externas"
```

---

## Task 5: Layout, SEO y navegación

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/Nav.tsx`, `src/components/BotonWhatsapp.tsx`
- Test: `src/components/Nav.test.tsx`

**Interfaces:**
- Consumes: `contenido`, `linkWhatsapp`
- Produces: `<Nav />`, `<BotonWhatsapp />`

- [ ] **Step 1: Escribir el test que falla**

`src/components/Nav.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Correr para verificar que falla**

Run: `npm test src/components/Nav.test.tsx`
Expected: FAIL — no existe `./Nav`.

- [ ] **Step 3: Implementar `src/components/Nav.tsx`**

```tsx
"use client";

import { useState } from "react";

const SECCIONES = [
  { href: "#habitaciones", label: "Habitaciones" },
  { href: "#galeria", label: "Fotos" },
  { href: "#equipamiento", label: "Equipamiento" },
  { href: "#normas", label: "Normas" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#faq", label: "Preguntas" },
];

export default function Nav() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-crema/95 backdrop-blur border-b border-borde">
      <nav className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
        <a href="#inicio" className="font-display text-lg text-terracota-fuerte leading-tight">
          Residencia <span className="hidden sm:inline">Estudiantil</span>
          <span className="block text-xs font-sans text-tinta-suave">San Luis</span>
        </a>

        <ul className="hidden lg:flex items-center gap-6 text-sm">
          {SECCIONES.map((s) => (
            <li key={s.href}>
              <a href={s.href} className="text-tinta-suave hover:text-terracota-fuerte transition-colors">
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#preinscripcion"
            className="hidden sm:inline-block rounded-full bg-terracota-fuerte px-5 py-2 text-sm font-medium text-white hover:bg-terracota transition-colors"
          >
            Preinscribirme
          </a>
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-mobile"
            aria-label="Menú"
            className="lg:hidden rounded-md p-2 text-tinta hover:bg-arena"
          >
            <span aria-hidden="true" className="block w-6 border-t-2 border-current" />
            <span aria-hidden="true" className="block w-6 border-t-2 border-current mt-1.5" />
            <span aria-hidden="true" className="block w-6 border-t-2 border-current mt-1.5" />
          </button>
        </div>
      </nav>

      {abierto && (
        <ul id="menu-mobile" className="lg:hidden border-t border-borde bg-crema px-4 py-3 space-y-1">
          {[...SECCIONES, { href: "#preinscripcion", label: "Preinscribirme" }].map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                onClick={() => setAbierto(false)}
                className="block rounded-md px-3 py-2.5 text-tinta hover:bg-arena"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Implementar `src/components/BotonWhatsapp.tsx`**

```tsx
import { contenido } from "@/content/residencia";
import { linkWhatsapp } from "@/lib/links";

const MENSAJE = "¡Hola! Vi la web de la residencia y quería hacer una consulta.";

export default function BotonWhatsapp() {
  return (
    <a
      href={linkWhatsapp(contenido.contacto.whatsapp, MENSAJE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg hover:brightness-95 transition"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.23 8.23 0 010 16.47z" />
      </svg>
      <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
    </a>
  );
}
```

- [ ] **Step 5: Reescribir `src/app/layout.tsx` con SEO completo**

```tsx
import type { Metadata } from "next";
import { contenido } from "@/content/residencia";
import Nav from "@/components/Nav";
import BotonWhatsapp from "@/components/BotonWhatsapp";
import "./globals.css";

const { sitio, contacto } = contenido;

export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  title: {
    default: `${sitio.nombre} — ${sitio.tagline}`,
    template: `%s | ${sitio.nombre}`,
  },
  description: sitio.descripcion,
  keywords: [
    "residencia estudiantil San Luis",
    "alquiler estudiantes San Luis",
    "habitacion estudiante UNSL",
    "pension estudiantil San Luis",
  ],
  // Open Graph: define como se ve el link cuando lo comparten por WhatsApp,
  // que es el canal por el que se va a difundir casi siempre.
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: sitio.url,
    siteName: sitio.nombre,
    title: `${sitio.nombre} — ${sitio.tagline}`,
    description: sitio.descripcion,
    // PNG obligatorio: las previews de WhatsApp y Facebook no renderizan SVG.
    images: [{ url: "/img/og-image.png", width: 1200, height: 800, alt: sitio.nombre }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

/** Datos estructurados: ayudan a Google a mostrar la ficha del lugar. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: sitio.nombre,
  description: sitio.descripcion,
  url: sitio.url,
  telephone: `+549${contacto.whatsapp}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Estado de Israel 2185",
    addressLocality: "San Luis",
    addressRegion: "San Luis",
    addressCountry: "AR",
  },
  amenityFeature: contenido.servicios.map((s) => ({
    "@type": "LocationFeatureSpecification",
    name: s.nombre,
    value: true,
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#inicio"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:m-3 focus:rounded focus:bg-terracota-fuerte focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        <Nav />
        {children}
        <BotonWhatsapp />
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Correr los tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Verificar el build**

Run: `npm run build`
Expected: build exitoso.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: layout con SEO, JSON-LD, navegacion y boton flotante de WhatsApp"
```

---

## Task 6: Hero, Servicios y Habitaciones

**Files:**
- Create: `src/components/Hero.tsx`, `src/components/Servicios.tsx`, `src/components/Habitaciones.tsx`, `src/components/Seccion.tsx`, `src/components/Icono.tsx`
- Test: `src/components/Habitaciones.test.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `contenido`, `linkWhatsapp`
- Produces: `<Seccion id titulo bajada>`, `<Icono nombre>`, `<Hero />`, `<Servicios />`, `<Habitaciones />`

- [ ] **Step 1: Escribir el test que falla**

`src/components/Habitaciones.test.tsx`:

```tsx
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
    expect(screen.getAllByText(/disponible/i)).toHaveLength(disponibles);
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
```

- [ ] **Step 2: Correr para verificar que falla**

Run: `npm test src/components/Habitaciones.test.tsx`
Expected: FAIL — no existe `./Habitaciones`.

- [ ] **Step 3: Crear `src/components/Seccion.tsx`**

```tsx
export default function Seccion({
  id,
  titulo,
  bajada,
  fondo = "crema",
  children,
}: {
  id: string;
  titulo: string;
  bajada?: string;
  fondo?: "crema" | "arena" | "blanco";
  children: React.ReactNode;
}) {
  const fondos = { crema: "bg-crema", arena: "bg-arena", blanco: "bg-superficie" };
  return (
    <section id={id} className={`${fondos[fondo]} py-16 sm:py-24`}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl sm:text-4xl text-terracota-fuerte">{titulo}</h2>
        {bajada && <p className="mt-3 max-w-2xl text-tinta-suave">{bajada}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Crear `src/components/Icono.tsx`**

```tsx
/** Iconos inline. Sin libreria externa: son seis y pesan menos asi. */
const PATHS: Record<string, string> = {
  wifi: "M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01",
  escoba: "M19 5l-7 7M8 21l-3-3 6-6 3 3-6 6zM14 10l3-3",
  luz: "M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z",
  agua: "M12 2.7s6 6.4 6 10.3a6 6 0 11-12 0c0-3.9 6-10.3 6-10.3z",
  gas: "M12 2s5 5 5 9a5 5 0 11-10 0c0-4 5-9 5-9zM12 16a2 2 0 002-2c0-1.5-2-3-2-3s-2 1.5-2 3a2 2 0 002 2z",
  cama: "M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6M3 18h18M3 18v2M21 18v2M7 10V7a1 1 0 011-1h3v4",
};

export default function Icono({ nombre, className = "h-6 w-6" }: { nombre: string; className?: string }) {
  const d = PATHS[nombre] ?? PATHS.cama;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
```

- [ ] **Step 5: Crear `src/components/Hero.tsx`**

```tsx
import { contenido } from "@/content/residencia";
import { linkWhatsapp } from "@/lib/links";

const MENSAJE = "¡Hola! Vi la web y quería consultar por una habitación.";

export default function Hero() {
  const { sitio, contacto, preinscripcion } = contenido;
  return (
    <section id="inicio" className="relative pt-16">
      <div className="relative min-h-[85vh] flex items-center">
        <img
          src="/img/fachada.svg"
          alt="Frente de la residencia estudiantil"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Degradado: sostiene el contraste del texto sobre cualquier foto */}
        <div className="absolute inset-0 bg-gradient-to-r from-tinta/85 via-tinta/60 to-tinta/25" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">
            {contacto.localidad}
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl max-w-3xl leading-tight">
            {sitio.tagline}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/90">
            Habitaciones privadas individuales y compartida, amobladas, con
            internet, luz, agua y gas incluidos. Somos una casa de 4 personas:
            tranquila, cuidada y cerca de todo.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#preinscripcion"
              className="rounded-full bg-terracota-fuerte px-7 py-3.5 font-medium hover:bg-terracota transition-colors"
            >
              {preinscripcion.titulo}
            </a>
            <a
              href={linkWhatsapp(contacto.whatsapp, MENSAJE)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-white/70 px-7 py-3.5 font-medium hover:bg-white hover:text-tinta transition-colors"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Crear `src/components/Servicios.tsx`**

```tsx
import { contenido } from "@/content/residencia";
import Seccion from "./Seccion";
import Icono from "./Icono";

export default function Servicios() {
  return (
    <Seccion
      id="servicios"
      titulo="Todo incluido"
      bajada="Sin facturas aparte ni sorpresas a fin de mes. Un solo pago y listo."
      fondo="arena"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {contenido.servicios.map((s) => (
          <li
            key={s.id}
            className={`rounded-2xl border p-6 ${
              s.destacado
                ? "border-terracota bg-terracota-claro sm:col-span-1"
                : "border-borde bg-superficie"
            }`}
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-terracota-fuerte text-white">
              <Icono nombre={s.icono} />
            </span>
            <h3 className="mt-4 font-display text-xl text-tinta">{s.nombre}</h3>
            <p className="mt-1.5 text-sm text-tinta-suave">{s.detalle}</p>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}
```

- [ ] **Step 7: Crear `src/components/Habitaciones.tsx`**

```tsx
import { contenido } from "@/content/residencia";
import { linkWhatsapp } from "@/lib/links";
import type { Disponibilidad } from "@/content/tipos";
import Seccion from "./Seccion";

const BADGE: Record<Disponibilidad, { texto: string; clase: string }> = {
  disponible: { texto: "Disponible", clase: "bg-verde-claro text-verde" },
  ocupada: { texto: "Ocupada", clase: "bg-arena text-tinta-suave" },
  consultar: { texto: "Consultar", clase: "bg-terracota-claro text-terracota-fuerte" },
};

export default function Habitaciones() {
  const { habitaciones, contacto } = contenido;
  return (
    <Seccion
      id="habitaciones"
      titulo="Las habitaciones"
      bajada="Dos privadas individuales y una compartida para dos personas. En total somos 4 personas en la casa, así que los espacios comunes nunca se sienten llenos."
    >
      <ul className="grid gap-6 md:grid-cols-3">
        {habitaciones.map((h) => {
          const badge = BADGE[h.disponibilidad];
          return (
            <li key={h.id}>
              <article className="h-full overflow-hidden rounded-2xl border border-borde bg-superficie flex flex-col">
                <img src={h.imagen} alt={h.nombre} className="h-52 w-full object-cover" />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl text-tinta">{h.nombre}</h3>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badge.clase}`}>
                      {badge.texto}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-tinta-suave flex-1">{h.descripcion}</p>
                  <p className="mt-4 text-sm text-tinta-suave">
                    Para {h.capacidad} {h.capacidad === 1 ? "persona" : "personas"}
                  </p>
                  <a
                    href={linkWhatsapp(
                      contacto.whatsapp,
                      `¡Hola! Quería consultar por la ${h.nombre.toLowerCase()}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block rounded-full border border-terracota-fuerte px-5 py-2.5 text-center text-sm font-medium text-terracota-fuerte hover:bg-terracota-fuerte hover:text-white transition-colors"
                  >
                    Consultar valores
                  </a>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </Seccion>
  );
}
```

- [ ] **Step 8: Actualizar `src/app/page.tsx`**

```tsx
import Hero from "@/components/Hero";
import Servicios from "@/components/Servicios";
import Habitaciones from "@/components/Habitaciones";

export default function Home() {
  return (
    <main>
      <Hero />
      <Servicios />
      <Habitaciones />
    </main>
  );
}
```

- [ ] **Step 9: Correr los tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: hero, servicios y habitaciones con badge de disponibilidad"
```

---

## Task 7: Galería con lightbox

**Files:**
- Create: `src/components/Galeria.tsx`
- Test: `src/components/Galeria.test.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `contenido.galeria`
- Produces: `<Galeria />`

- [ ] **Step 1: Escribir el test que falla**

`src/components/Galeria.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Correr para verificar que falla**

Run: `npm test src/components/Galeria.test.tsx`
Expected: FAIL — no existe `./Galeria`.

- [ ] **Step 3: Implementar `src/components/Galeria.tsx`**

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { contenido } from "@/content/residencia";
import Seccion from "./Seccion";

export default function Galeria() {
  const items = contenido.galeria;
  const [indice, setIndice] = useState<number | null>(null);
  const abierto = indice !== null;

  const cerrar = useCallback(() => setIndice(null), []);
  const mover = useCallback(
    (delta: number) =>
      setIndice((i) => (i === null ? null : (i + delta + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    document.addEventListener("keydown", onKey);
    // Evita que la pagina siga scrolleando detras del lightbox
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [abierto, cerrar, mover]);

  const actual = indice !== null ? items[indice] : null;

  return (
    <Seccion
      id="galeria"
      titulo="Conocé la casa"
      bajada="Así es la residencia por dentro. Si querés verla en persona, escribinos y coordinamos una visita."
      fondo="blanco"
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setIndice(i)}
              aria-label={`Ampliar: ${item.alt}`}
              className="group block w-full overflow-hidden rounded-xl border border-borde focus:outline-none focus:ring-2 focus:ring-terracota-fuerte"
            >
              {item.tipo === "video" ? (
                <img src={item.poster ?? item.src} alt={item.alt}
                  className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <img src={item.src} alt={item.alt}
                  className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105" />
              )}
            </button>
          </li>
        ))}
      </ul>

      {actual && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={actual.alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-tinta/90 p-4"
          onClick={cerrar}
        >
          <div className="relative max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {actual.tipo === "video" ? (
              <video src={actual.src} poster={actual.poster} controls
                className="max-h-[80vh] w-full rounded-lg" />
            ) : (
              <img src={actual.src} alt={actual.alt}
                className="max-h-[80vh] w-full rounded-lg object-contain" />
            )}
            <p className="mt-3 text-center text-sm text-white/90">{actual.alt}</p>
          </div>

          <button type="button" onClick={cerrar} aria-label="Cerrar"
            className="absolute right-4 top-4 rounded-full bg-white/15 px-4 py-2 text-2xl leading-none text-white hover:bg-white/25">
            ×
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); mover(-1); }} aria-label="Anterior"
            className="absolute left-3 rounded-full bg-white/15 px-4 py-3 text-white hover:bg-white/25">
            ‹
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); mover(1); }} aria-label="Siguiente"
            className="absolute right-3 rounded-full bg-white/15 px-4 py-3 text-white hover:bg-white/25">
            ›
          </button>
        </div>
      )}
    </Seccion>
  );
}
```

- [ ] **Step 4: Agregar `<Galeria />` a `src/app/page.tsx`**

Después de `<Habitaciones />`.

- [ ] **Step 5: Correr los tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: galeria con lightbox navegable por teclado"
```

---

## Task 8: Equipamiento y Normas

**Files:**
- Create: `src/components/Equipamiento.tsx`, `src/components/Normas.tsx`
- Test: `src/components/Equipamiento.test.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `contenido.equipamiento`, `contenido.normas`
- Produces: `<Equipamiento />`, `<Normas />`

- [ ] **Step 1: Escribir el test que falla**

`src/components/Equipamiento.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Correr para verificar que falla**

Run: `npm test src/components/Equipamiento.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `src/components/Equipamiento.tsx`**

```tsx
import { contenido } from "@/content/residencia";
import Seccion from "./Seccion";

export default function Equipamiento() {
  const propio = contenido.equipamiento.filter((e) => e.uso === "propio");
  const compartido = contenido.equipamiento.filter((e) => e.uso === "compartido");

  const Lista = ({ items }: { items: typeof propio }) => (
    <ul className="mt-4 space-y-2.5">
      {items.map((e) => (
        <li key={e.id} className="flex items-center gap-3 text-tinta-suave">
          <span aria-hidden="true" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-verde-claro text-verde text-xs">✓</span>
          {e.nombre}
        </li>
      ))}
    </ul>
  );

  return (
    <Seccion
      id="equipamiento"
      titulo="Qué vas a encontrar"
      bajada="La casa viene equipada. Vos traés tus cosas y poco más."
      fondo="arena"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-borde bg-superficie p-7">
          <h3 className="font-display text-2xl text-terracota-fuerte">En tu habitación</h3>
          <p className="mt-1 text-sm text-tinta-suave">De uso exclusivo tuyo.</p>
          <Lista items={propio} />
        </div>
        <div className="rounded-2xl border border-borde bg-superficie p-7">
          <h3 className="font-display text-2xl text-terracota-fuerte">Espacios compartidos</h3>
          {/* El numero es lo que vuelve tolerable lo compartido. Va siempre visible. */}
          <p className="mt-1 text-sm text-tinta-suave">
            Compartidos entre <strong className="text-tinta">4 personas</strong> en total.
            La limpieza de estos espacios la hacemos nosotros.
          </p>
          <Lista items={compartido} />
        </div>
      </div>
    </Seccion>
  );
}
```

- [ ] **Step 4: Implementar `src/components/Normas.tsx`**

```tsx
import { contenido } from "@/content/residencia";
import Seccion from "./Seccion";

export default function Normas() {
  return (
    <Seccion
      id="normas"
      titulo="Cómo convivimos"
      bajada="Pocas reglas, claras desde el principio. Están para que la casa sea un buen lugar donde estudiar y descansar."
    >
      <ul className="grid gap-5 sm:grid-cols-2">
        {contenido.normas.map((n, i) => (
          <li key={n.id} className="flex gap-4 rounded-2xl border border-borde bg-superficie p-6">
            <span aria-hidden="true" className="font-display text-2xl text-terracota/50">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-lg text-tinta">{n.titulo}</h3>
              <p className="mt-1 text-sm text-tinta-suave">{n.detalle}</p>
            </div>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}
```

- [ ] **Step 5: Agregar ambos a `src/app/page.tsx`**, después de `<Galeria />`.

- [ ] **Step 6: Correr los tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: secciones de equipamiento y normas de convivencia"
```

---

## Task 9: Ubicación y lugares cercanos

**Files:**
- Create: `src/components/Ubicacion.tsx`
- Test: `src/components/Ubicacion.test.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `contenido.lugaresCercanos`, `contenido.contacto.direccion`, `linkMapaEmbed`, `linkComoLlegar`
- Produces: `<Ubicacion />`

- [ ] **Step 1: Escribir el test que falla**

`src/components/Ubicacion.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Ubicacion from "./Ubicacion";
import { contenido } from "@/content/residencia";

describe("Ubicacion", () => {
  it("muestra la direccion de la residencia", () => {
    render(<Ubicacion />);
    expect(screen.getByText(/Estado de Israel 2185/i)).toBeInTheDocument();
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
    const links = screen.getAllByRole("link", { name: /c[oó]mo llegar/i });
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
```

- [ ] **Step 2: Correr para verificar que falla**

Run: `npm test src/components/Ubicacion.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `src/components/Ubicacion.tsx`**

```tsx
import { contenido } from "@/content/residencia";
import { linkMapaEmbed, linkComoLlegar } from "@/lib/links";
import Seccion from "./Seccion";

const ETIQUETA: Record<string, string> = {
  universidad: "Universidad",
  transporte: "Transporte",
  comercio: "Comercios",
  ciudad: "Ciudad",
};

export default function Ubicacion() {
  const { contacto, lugaresCercanos } = contenido;

  return (
    <Seccion
      id="ubicacion"
      titulo="Dónde estamos"
      bajada="Tocá “Cómo llegar” en cualquier lugar y Google Maps te calcula la ruta real desde la puerta de la residencia."
      fondo="blanco"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl border border-borde">
            <iframe
              src={linkMapaEmbed(contacto.direccion)}
              title={`Mapa: ${contacto.direccion}`}
              className="h-[380px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-4 font-display text-lg text-tinta">{contacto.direccion}</p>
          <a
            href={linkComoLlegar("Mi ubicación", contacto.direccion)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-full bg-terracota-fuerte px-6 py-3 text-sm font-medium text-white hover:bg-terracota transition-colors"
          >
            Cómo llegar a la residencia
          </a>
        </div>

        <div>
          <h3 className="font-display text-2xl text-terracota-fuerte">Qué tenés cerca</h3>
          <ul className="mt-5 space-y-3">
            {lugaresCercanos.map((lugar) => (
              <li key={lugar.id} className="rounded-2xl border border-borde bg-crema p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-terracota">
                      {ETIQUETA[lugar.categoria]}
                    </span>
                    <h4 className="font-display text-lg text-tinta">{lugar.nombre}</h4>
                    <p className="mt-1 text-sm text-tinta-suave">{lugar.descripcion}</p>
                    {/* Solo se muestra si fue verificado. Ver PREGUNTA(distancias). */}
                    {lugar.minutosCaminando !== null && (
                      <p className="mt-1 text-sm font-medium text-verde">
                        {lugar.minutosCaminando} min caminando
                      </p>
                    )}
                  </div>
                  <a
                    href={linkComoLlegar(contacto.direccion, lugar.direccion)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-full border border-terracota-fuerte px-4 py-2 text-sm text-terracota-fuerte hover:bg-terracota-fuerte hover:text-white transition-colors"
                  >
                    Cómo llegar
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Seccion>
  );
}
```

- [ ] **Step 4: Agregar `<Ubicacion />` a `src/app/page.tsx`**, después de `<Normas />`.

- [ ] **Step 5: Correr los tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: ubicacion con mapa embebido y rutas reales a lugares cercanos"
```

---

## Task 10: FAQ, Preinscripción, Contacto y Footer

**Files:**
- Create: `src/components/Faq.tsx`, `src/components/Preinscripcion.tsx`, `src/components/Contacto.tsx`, `src/components/Footer.tsx`
- Test: `src/components/Preinscripcion.test.tsx`, `src/components/Faq.test.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `contenido.faq`, `contenido.preinscripcion`, `contenido.contacto`, `linkWhatsapp`
- Produces: `<Faq />`, `<Preinscripcion />`, `<Contacto />`, `<Footer />`

- [ ] **Step 1: Escribir los tests que fallan**

`src/components/Faq.test.tsx`:

```tsx
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
```

`src/components/Preinscripcion.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Preinscripcion from "./Preinscripcion";
import { contenido } from "@/content/residencia";

describe("Preinscripcion", () => {
  it("cuando hay formulario cargado, el CTA apunta a el y abre en pestana nueva", () => {
    render(<Preinscripcion />);
    if (contenido.preinscripcion.urlFormulario) {
      const cta = screen.getByRole("link", { name: /formulario|preinscrib/i });
      expect(cta).toHaveAttribute("href", contenido.preinscripcion.urlFormulario);
      expect(cta).toHaveAttribute("target", "_blank");
    }
  });

  it("cuando el formulario todavia no esta cargado, ofrece WhatsApp en vez de un link roto", () => {
    render(<Preinscripcion />);
    if (!contenido.preinscripcion.urlFormulario) {
      const cta = screen.getByRole("link", { name: /whatsapp/i });
      expect(cta.getAttribute("href")).toContain("wa.me");
      // Nunca un href vacio o "#": seria un CTA muerto en el punto de conversion
      expect(cta.getAttribute("href")).not.toBe("#");
    }
  });
});
```

- [ ] **Step 2: Correr para verificar que fallan**

Run: `npm test`
Expected: FAIL — no existen los componentes.

- [ ] **Step 3: Implementar `src/components/Faq.tsx`**

```tsx
"use client";

import { useState } from "react";
import { contenido } from "@/content/residencia";
import Seccion from "./Seccion";

export default function Faq() {
  const [abierta, setAbierta] = useState<string | null>(null);

  return (
    <Seccion
      id="faq"
      titulo="Preguntas frecuentes"
      bajada="Si tu pregunta no está acá, escribinos por WhatsApp: contestamos rápido."
      fondo="arena"
    >
      <ul className="mx-auto max-w-3xl space-y-3">
        {contenido.faq.map((p) => {
          const activa = abierta === p.id;
          return (
            <li key={p.id} className="overflow-hidden rounded-2xl border border-borde bg-superficie">
              <button
                type="button"
                onClick={() => setAbierta(activa ? null : p.id)}
                aria-expanded={activa}
                aria-controls={`faq-${p.id}`}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-medium text-tinta">{p.pregunta}</span>
                <span aria-hidden="true" className={`shrink-0 text-2xl text-terracota transition-transform ${activa ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              {activa && (
                <div id={`faq-${p.id}`} className="border-t border-borde px-6 py-5 text-tinta-suave">
                  {p.respuesta}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Seccion>
  );
}
```

- [ ] **Step 4: Implementar `src/components/Preinscripcion.tsx`**

Manejo explícito del caso "todavía no hay formulario": en vez de un link roto,
cae a WhatsApp. Un CTA muerto justo en el punto de conversión es la peor falla
posible de este sitio.

```tsx
import { contenido } from "@/content/residencia";
import { linkWhatsapp } from "@/lib/links";

const MENSAJE = "¡Hola! Quiero preinscribirme en la residencia.";

export default function Preinscripcion() {
  const { preinscripcion, contacto } = contenido;
  const hayFormulario = preinscripcion.urlFormulario.trim().length > 0;

  const destino = hayFormulario
    ? preinscripcion.urlFormulario
    : linkWhatsapp(contacto.whatsapp, MENSAJE);

  const etiqueta = hayFormulario
    ? "Ir al formulario de preinscripción"
    : "Escribinos por WhatsApp";

  return (
    <section id="preinscripcion" className="bg-terracota-fuerte py-20 text-white sm:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="font-display text-3xl sm:text-5xl">{preinscripcion.titulo}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">{preinscripcion.texto}</p>
        <a
          href={destino}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-9 inline-block rounded-full bg-white px-9 py-4 font-medium text-terracota-fuerte hover:bg-crema transition-colors"
        >
          {etiqueta}
        </a>
        <p className="mt-5 text-sm text-white/70">
          Sin costo y sin compromiso. Te contactamos para coordinar una visita.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Implementar `src/components/Contacto.tsx`**

```tsx
import { contenido } from "@/content/residencia";
import { linkWhatsapp, linkComoLlegar } from "@/lib/links";
import Seccion from "./Seccion";

const MENSAJE = "¡Hola! Quería hacer una consulta sobre la residencia.";

export default function Contacto() {
  const { contacto } = contenido;
  return (
    <Seccion
      id="contacto"
      titulo="Hablemos"
      bajada="La forma más rápida de sacarte una duda es escribirnos. Contestamos por WhatsApp todos los días."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <a
          href={linkWhatsapp(contacto.whatsapp, MENSAJE)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-borde bg-superficie p-7 hover:border-terracota transition-colors"
        >
          <h3 className="font-display text-xl text-terracota-fuerte">WhatsApp</h3>
          <p className="mt-2 text-2xl text-tinta">{contacto.whatsappMostrado}</p>
          <p className="mt-2 text-sm text-tinta-suave">Tocá para abrir el chat.</p>
        </a>
        <a
          href={linkComoLlegar("Mi ubicación", contacto.direccion)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-borde bg-superficie p-7 hover:border-terracota transition-colors"
        >
          <h3 className="font-display text-xl text-terracota-fuerte">Dónde estamos</h3>
          <p className="mt-2 text-lg text-tinta">{contacto.direccion}</p>
          <p className="mt-2 text-sm text-tinta-suave">Tocá para abrir el mapa.</p>
        </a>
      </div>
    </Seccion>
  );
}
```

- [ ] **Step 6: Implementar `src/components/Footer.tsx`**

```tsx
import { contenido } from "@/content/residencia";

export default function Footer() {
  const { sitio, contacto } = contenido;
  return (
    <footer className="border-t border-borde bg-arena py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-sm text-tinta-suave sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-base text-terracota-fuerte">{sitio.nombre}</p>
        <p>{contacto.direccion}</p>
        <p>WhatsApp {contacto.whatsappMostrado}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 7: Completar `src/app/page.tsx`**

```tsx
import Hero from "@/components/Hero";
import Servicios from "@/components/Servicios";
import Habitaciones from "@/components/Habitaciones";
import Galeria from "@/components/Galeria";
import Equipamiento from "@/components/Equipamiento";
import Normas from "@/components/Normas";
import Ubicacion from "@/components/Ubicacion";
import Faq from "@/components/Faq";
import Preinscripcion from "@/components/Preinscripcion";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Servicios />
        <Habitaciones />
        <Galeria />
        <Equipamiento />
        <Normas />
        <Ubicacion />
        <Faq />
        <Preinscripcion />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 8: Correr los tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 9: Verificar el build**

Run: `npm run build`
Expected: build exitoso, `out/index.html` generado.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: faq, preinscripcion con fallback a WhatsApp, contacto y footer"
```

---

## Task 11: README para no técnicos y verificación final

**Files:**
- Create: `README.md`
- Test: verificación manual documentada

**Interfaces:**
- Consumes: todo lo anterior
- Produces: sitio listo para deploy + documentación de mantenimiento

- [ ] **Step 1: Escribir `README.md`**

Escrito para alguien que no programa. Debe cubrir, con el bloque de código exacto
a editar en cada caso:

1. Qué es este proyecto y qué NO hace (no cobra, no reserva, no guarda datos).
2. **Cambiar el teléfono** → `src/content/residencia.ts`, campos `contacto.whatsapp`
   (solo números, sin espacios) y `contacto.whatsappMostrado` (como se ve en pantalla).
3. **Marcar una habitación como ocupada** → cambiar `disponibilidad` de
   `"disponible"` a `"ocupada"`. Los tres valores válidos y qué muestra cada uno.
4. **Cargar el link del Google Form** → `preinscripcion.urlFormulario`.
   Advertir: mientras esté vacío, el botón cae a WhatsApp automáticamente.
5. **Reemplazar las fotos** → poner los `.jpg` en `public/img/` con el nombre que
   corresponde, y cambiar la extensión `.svg` → `.jpg` en `residencia.ts`.
   Listar el nombre de archivo esperado para cada foto.
6. **Editar normas, FAQ o equipamiento** → los arrays correspondientes.
7. Comandos: `npm run dev` (ver en la compu), `npm run build` (generar `out/`),
   `npm test`.
8. **Deploy en Netlify**: arrastrar la carpeta `out/` a netlify.com/drop.
9. **Sección "Antes de publicar"** con el checklist de la Task 11 Step 4.

- [ ] **Step 2: Correr toda la suite**

Run: `npm test`
Expected: PASS, sin tests salteados.

- [ ] **Step 3: Verificar el build limpio**

```bash
rm -rf out .next && npm run build && ls out/
```
Expected: `index.html`, `404.html`, `_next/`, `img/`.

- [ ] **Step 4: Escribir el checklist de publicación en el README**

```markdown
## Antes de publicar

- [ ] Cargar el link del Google Form en `preinscripcion.urlFormulario`
- [ ] Reemplazar los placeholders por fotos reales
- [ ] Que la familia lea y apruebe las normas (hoy son un borrador)
- [ ] Definir si el colchón lo pone la residencia o el estudiante
- [ ] Verificar las distancias reales a UNSL, terminal y centro, o dejarlas en null
- [ ] Confirmar depósito / garantía / plazo mínimo y agregarlos al FAQ
- [ ] Reemplazar `public/img/og-image.png` por una foto real de la casa
      (es la imagen que ve la gente cuando le comparten el link por WhatsApp)
- [ ] Cargar el dominio final en `sitio.url` (afecta el preview de WhatsApp)
- [ ] Revisar que no quede ningún `PREGUNTA(` sin resolver: `grep -rn "PREGUNTA(" src/`
```

- [ ] **Step 5: Verificación manual en el navegador**

Correr `npm run dev` y confirmar, anotando el resultado de cada punto:

1. En celular (DevTools, 375px): el menú hamburguesa abre y cierra; nada
   desborda horizontalmente; el botón de WhatsApp no tapa contenido.
2. Todos los links del nav saltan a su sección sin que el header fijo tape el título.
3. El lightbox de la galería abre, navega con flechas y cierra con Escape.
4. El mapa carga y muestra Estado de Israel 2185.
5. Cada "Cómo llegar" abre Google Maps con origen y destino correctos.
6. El botón de WhatsApp abre el chat al número correcto con el mensaje prellenado.
7. Recorrer toda la página **solo con Tab**: todo control es alcanzable y el foco
   se ve. El link "Saltar al contenido" aparece al primer Tab.
8. No aparece ningún precio, ningún mail, ninguna mención al colchón, ni ningún
   tiempo en minutos inventado.

- [ ] **Step 6: Commit final**

```bash
git add -A
git commit -m "docs: README de mantenimiento para no tecnicos y checklist de publicacion"
```

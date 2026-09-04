# Residencia Estudiantil en San Luis — sitio web

Sitio promocional de la residencia. Muestra la casa, las habitaciones, las
normas y la ubicación, y lleva a la gente al formulario de preinscripción y a
WhatsApp.

**Qué NO hace:** no cobra, no reserva, no guarda datos de nadie. Es una página
que se mira; todo el contacto pasa por WhatsApp y por el Google Form.

---

## Lo único que hace falta saber para mantenerlo

**Todo lo que se lee en la web está en un solo archivo:**

```
src/content/residencia.ts
```

No hace falta tocar nada más. Abrilo con cualquier editor de texto, cambiá lo
que necesites entre comillas, guardá y volvé a publicar.

**Regla de oro:** cambiá solo lo que está entre comillas `"asi"`. Si borrás una
coma o una llave, el sitio no compila.

---

### Cambiar el teléfono de WhatsApp

Buscá `contacto` y editá los dos campos:

```ts
contacto: {
  whatsapp: "2664503103",        // solo numeros, sin espacios ni guiones
  whatsappMostrado: "266 450-3103",  // como se ve en pantalla
```

El primero arma el link del chat, el segundo es el texto que lee la gente.
**Hay que cambiar los dos.**

---

### Marcar una habitación como ocupada

Buscá `habitaciones` y cambiá el campo `disponibilidad`:

```ts
disponibilidad: "disponible",
```

Los tres valores posibles:

| Valor | Qué muestra en la web |
|---|---|
| `"disponible"` | Cartelito verde **Disponible** |
| `"ocupada"` | Cartelito gris **Ocupada** |
| `"consultar"` | Cartelito naranja **Consultar** |

Escribilo tal cual, en minúscula y entre comillas.

---

### Cargar el link del formulario de preinscripción

Buscá `preinscripcion` y pegá la dirección del Google Form:

```ts
preinscripcion: {
  urlFormulario: "",   // <-- pegar aca el link del Google Form
```

**Mientras esté vacío**, el botón grande de "Reservá tu lugar" abre WhatsApp en
lugar del formulario. Es a propósito: es preferible que la gente escriba por
WhatsApp antes que tocar un botón que no lleva a ningún lado.

### Marcar un servicio como incluido o a confirmar

En la lista `servicios`, cada uno tiene un campo `incluido`:

```ts
incluido: "si",           // muestra la etiqueta verde "Incluido"
incluido: "a-confirmar",  // muestra la etiqueta gris "Consultar"
```

Mientras un servicio esté en `"a-confirmar"`, **el sitio no puede decir que está
incluido**. Hay una verificación automática que falla si el texto lo promete.
Es a propósito: prometer que la luz está incluida y después cobrar una expensa
es la forma más rápida de perder la confianza de alguien que ya se mudó.

---

### Reemplazar las fotos

Las imágenes que se ven hoy son dibujos que dicen "FOTO PENDIENTE". Para poner
las reales:

**1.** Poné las fotos en la carpeta `public/img/` con estos nombres exactos:

| Archivo | Qué foto va |
|---|---|
| `fachada.jpg` | El frente de la casa (es la que se ve grande arriba de todo) |
| `living.jpg` | El espacio común de estar |
| `cocina.jpg` | La cocina |
| `bano.jpg` | El baño |
| `habitacion-privada-1.jpg` | Primera habitación individual |
| `habitacion-privada-2.jpg` | Segunda habitación individual |
| `habitacion-compartida.jpg` | La habitación de dos |
| `patio.jpg` | El patio |
| `og-image.jpg` | La foto que aparece cuando compartís el link por WhatsApp |

**2.** En `src/content/residencia.ts`, cambiá `.svg` por `.jpg` en todas las
rutas de imagen. Son las líneas que dicen `/img/algo.svg`.

**3.** En `src/app/layout.tsx` y `src/components/Hero.tsx` hay dos rutas más
(`og-image.png` y `fachada.svg`) que también hay que actualizar.

**Consejo sobre las fotos:** sacalas de día, con las persianas abiertas y las
camas hechas. Una foto luminosa de una habitación simple vende mucho más que
una foto oscura de una habitación linda.

---

### Editar normas, preguntas frecuentes o equipamiento

Están en las listas `normas`, `faq` y `equipamiento` del mismo archivo. Cada
elemento sigue siempre el mismo formato; copiá uno existente y cambiale el
texto.

Para **agregar** un elemento, copiá el bloque entero desde `{` hasta `},` y
pegalo debajo. Para **sacar** uno, borrá desde su `{` hasta su `},`.

---

## Comandos

```bash
npm run dev
```
Levanta el sitio en `http://localhost:3000` para verlo en la computadora
mientras lo editás. Se actualiza solo al guardar.

```bash
npm run build
```
Genera la carpeta `out/`, que es el sitio listo para publicar.

```bash
npm test
```
Corre las verificaciones automáticas. Si algo se rompió al editar, avisa acá.

---

## Publicar

1. Correr `npm run build`
2. Entrar a [netlify.com/drop](https://app.netlify.com/drop)
3. Arrastrar la carpeta `out/` a la página

Listo. Netlify devuelve una dirección web que se puede compartir. Es gratis.

---

## Antes de publicar

- [x] ~~Cargar el link del Google Form~~ (hecho el 2026-09-04)
- [ ] **Definir si luz, agua y gas van incluidos o se cobran aparte como expensa.**
      Hasta que se decida, el sitio muestra "Consultar" en esos tres y no
      promete que estan incluidos. Para cerrarlo: en `servicios`, cambiar
      `incluido: "a-confirmar"` por `incluido: "si"`, o ajustar el `detalle`
      si van aparte. Hay un test que falla si se promete sin confirmar.
- [ ] Reemplazar los placeholders por fotos reales
- [ ] Reemplazar `public/img/og-image.png` por una foto real de la casa
      (es la imagen que ve la gente cuando le comparten el link por WhatsApp)
- [ ] Que la familia lea y apruebe las normas (hoy son un borrador)
- [ ] Definir si el colchón lo pone la residencia o el estudiante
- [ ] Verificar las distancias reales a UNSL, terminal y centro, o dejarlas en `null`
- [ ] Confirmar depósito / garantía / plazo mínimo y agregarlos al FAQ
- [ ] Cargar el dominio final en `sitio.url` (afecta el preview de WhatsApp)
- [ ] Revisar que no quede ninguna duda sin resolver:

```bash
grep -rn "PREGUNTA(" src/
```

---

## Notas técnicas

**Stack:** Next.js 15 con `output: "export"` (genera HTML estático, sin
servidor), Tailwind CSS v4, TypeScript. Tests con Vitest.

**TypeScript está fijado en la versión 5** a propósito. Next.js 15 todavía no
soporta el compilador nativo de TypeScript 7; si se actualiza, el build deja de
funcionar con un error poco claro (`Cannot read properties of undefined`).

**El mapa no usa API key.** Es un iframe del embed público de Google Maps, así
que no depende de una cuenta de Google Cloud ni puede cortarse por cuota.

**`npm audit` reporta dos vulnerabilidades de PostCSS.** Son de la copia que
Next 15 trae adentro, no de la nuestra. Para explotarlas hay que inyectar CSS
malicioso en el build; acá el CSS lo escribimos nosotros y la salida es HTML
estático, así que no hay superficie de ataque. El único fix disponible es
actualizar a Next 16, un cambio de versión mayor que no se justifica por esto.
Revisar de nuevo si alguna vez se migra a Next 16.

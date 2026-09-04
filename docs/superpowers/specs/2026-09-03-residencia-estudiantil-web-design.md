# Web promocional — Residencia Estudiantil San Luis

**Fecha:** 2026-09-03
**Tipo de proyecto:** **Producto.** No es una demo. Va a tener dominio público,
gente real cargando datos en un formulario, y se queda. Se construye con
requerimientos escritos antes del código.

---

## 1. Objetivo

Una página que **promociona** la residencia y **lleva a preinscribirse**.

Todo lo demás está subordinado a eso. Cada sección existe o para dar confianza
(fotos, normas, ubicación) o para sacar una objeción de encima antes de que
frene la conversión (FAQ, cercanías, equipamiento).

**Métrica de éxito:** que un estudiante o su familia entre desde un link de
WhatsApp, entienda en un scroll si el lugar les sirve, y termine en el
formulario o en el chat.

### Quién decide

Dos audiencias, no una:

- **El estudiante** — le importan internet, ubicación respecto de la UNSL, y
  cómo se ve el lugar.
- **La madre o el padre** — suelen pagar y suelen decidir. Les importa que sea
  seguro, limpio, ordenado y con normas claras.

El tono cálido y hogareño de todo el sitio es una decisión tomada para el
segundo grupo sin perder al primero.

---

## 2. Datos confirmados

| Dato | Valor |
|---|---|
| Ubicación | Estado de Israel 2185, San Luis, Argentina |
| WhatsApp | 266 450-3103 (link: `wa.me/5492664503103`) |
| Mail | **No se publica.** Contacto sólo por WhatsApp y formulario |
| Habitaciones | 2 privadas individuales + 1 compartida para 2 personas (4 camas totales) |
| Servicios incluidos | Internet, luz, agua, gas |
| Baño | Compartido |
| Cocina | Compartida |
| Amoblado | Sí. Colchón a definir |
| Precios | **No se publican.** "Consultar valores" → WhatsApp |
| Nombre / marca | Sin nombre propio por ahora. Genérico: "Residencia Estudiantil en San Luis" |
| Formulario | Google Form externo. Link pendiente |

---

## 3. Decisiones de arquitectura

### 3.1 Stack

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4, con `output: 'export'`.

El resultado es HTML estático: sin servidor, sin costo mensual, deploy gratis en
Netlify o Vercel.

**Trade-off asumido, explícito:** una landing de 10 secciones no necesita React.
HTML plano alcanzaba y era más simple de mantener para alguien no técnico. Se
eligió Next.js por decisión del autor — suma al portfolio y el costo real es
sólo un paso de build. Queda registrado para que nadie lo confunda con una
necesidad técnica.

### 3.2 Una sola página, no rutas

Todo el contenido vive en `/`, en secciones ancladas con navegación por scroll.

Quien busca dónde vivir decide en un scroll continuo. Partirlo en rutas agrega
clics y puntos de abandono sin dar nada a cambio.

**Excepción prevista:** si el reglamento completo crece más allá de un extracto,
va a `/normas` como página aparte, enlazada desde la sección.

### 3.3 La decisión central: contenido separado del código

**Todo el contenido editable vive en `src/content/residencia.ts`.** Los
componentes sólo lo leen; ninguno tiene texto ni datos hardcodeados.

Ahí van: dirección, WhatsApp, link del formulario, habitaciones y su
disponibilidad, servicios, equipamiento, normas, lugares cercanos, FAQ, y el
nombre del sitio.

Tres razones concretas:

1. Cambiar un teléfono o marcar una habitación como ocupada no exige abrir un
   componente React ni entender JSX.
2. Cuando la residencia tenga nombre propio, ponerlo es editar una línea, no
   buscar el string en 30 archivos.
3. La disponibilidad de habitaciones va a cambiar cada ciclo lectivo. Tiene que
   ser el cambio más barato posible o no se va a hacer, y el sitio va a mentir.

### 3.4 Mapa sin API key

El mapa embebido usa un iframe de `google.com/maps?q=...&output=embed`, **no** la
Maps Embed API.

No requiere cuenta de Google Cloud, ni tarjeta de crédito, ni puede cortarse por
superar una cuota. Para mostrar un punto fijo la API oficial no aporta nada que
justifique esa dependencia.

Los links "Cómo llegar" de cada lugar cercano son URLs directas de Google Maps
Directions con la residencia como origen, así que funcionan en el celular
abriendo la app nativa.

### 3.5 Placeholders locales

No hay fotos ni videos todavía. Los placeholders se generan como **archivos
locales** en `public/`, no desde un servicio externo tipo `placeholder.com`.

Un servicio externo es una dependencia que algún día responde 404 y rompe la
página en producción sin que nadie toque el código.

Cada placeholder tiene el nombre del archivo final que lo va a reemplazar
(`habitacion-privada-1.jpg`, etc.), así que cargar las fotos reales es
sobrescribir archivos — sin tocar código.

---

## 4. Secciones

En orden de scroll:

| # | Sección | Qué hace |
|---|---|---|
| 1 | **Hero** | Fachada, "Residencia estudiantil en San Luis", servicios en una línea, y dos CTA: *Preinscribirme* (primario) y *WhatsApp* (secundario) |
| 2 | **Servicios incluidos** | Internet, luz, agua, gas. Íconos, sin texto de más |
| 3 | **Habitaciones** | 2 privadas + 1 compartida, cada una con badge disponible/ocupada |
| 4 | **Galería** | Fotos y videos con lightbox. Placeholders hasta que lleguen las reales |
| 5 | **Equipamiento** | Qué hay en la casa y qué es compartido |
| 6 | **Normas de convivencia** | Extracto de 5–7 puntos, no el reglamento entero |
| 7 | **Ubicación y cercanías** | Mapa + UNSL, terminal, supermercados, centro. Cada uno con distancia y "Cómo llegar" |
| 8 | **Preguntas frecuentes** | Acordeón. Saca objeciones antes de que frenen |
| 9 | **Preinscripción** | CTA fuerte al Google Form |
| 10 | **Contacto** | WhatsApp y dirección. Sin mail |
| 11 | Footer | |

Más: **botón flotante de WhatsApp**, persistente en todo el scroll.

### 4.1 Cómo se presenta lo compartido

Baño y cocina compartidos son un hecho, y el sitio lo dice de frente — pero con
el dato que lo vuelve tolerable: **son 4 personas en total en la casa**. "Baño
compartido entre 4" es una situación completamente distinta de un baño
compartido en una pensión de 20, y quien lee necesita ese número para
entenderlo.

Ocultarlo sería peor que inútil: la persona se entera en la visita y siente que
le mintieron, justo cuando estaba por decidir.

---

## 5. Agregados fuera del pedido original

Cada uno con su justificación. Si alguno no convence, se saca.

- **Preguntas frecuentes** — es lo que más reduce el WhatsApp repetido. Las
  mismas cinco preguntas llegan una y otra vez; contestarlas en la página
  libera tiempo real de tu familia.
- **Botón flotante de WhatsApp** — estándar en Argentina, sube conversión de
  forma medible.
- **SEO local + Open Graph + JSON-LD** — para aparecer en búsquedas de
  "residencia estudiantil San Luis", y para que el link se vea con foto y
  título cuando lo compartan por WhatsApp. Ese es el canal real por el que se va
  a difundir, así que la tarjeta de preview importa más que el ranking.
- **Badge de disponibilidad** — evita consultas por habitaciones que ya no hay.

---

## 6. Fuera de alcance

No se construye, y no por falta de tiempo sino porque no le sirven a este sitio:

autenticación, CMS, backend propio, base de datos, panel de administración,
dark mode, internacionalización, sistema de pagos, calendario de reservas.

---

## 7. Puntos de no retorno

Cruzar cualquiera de estos cambia el estado del proyecto y **se avisa antes**:

- Publicar en un dominio propio
- Recibir datos reales de personas por el formulario
- Que alguien de la familia edite el sitio sin asistencia técnica
- Agregar cualquier cosa que guarde datos del lado del servidor

---

## 8. Preguntas abiertas

Marcadas en el código con `PREGUNTA(`. Recuperables con:

```
grep -rn "PREGUNTA(" src/
```

| Tema | Pregunta | Supuesto mientras tanto |
|---|---|---|
| `colchon` | ¿Lo pone la residencia o lo trae el estudiante? | **Recomendación: ponerlo la residencia.** Nadie viaja desde otra provincia con un colchón. Es un costo chico que saca una fricción grande, y habilita el argumento "vení con un bolso". Mientras no se defina, la web no lo menciona |
| `formulario` | Link del Google Form | Placeholder. **El sitio no se publica sin esto** — es el objetivo de conversión |
| `bano-cantidad` | ¿Un solo baño para las 4 personas, o más de uno? | Se asume uno. Si hubiera dos, es un argumento fuerte y hay que decirlo |
| `deposito` | ¿Se pide depósito, garantía o mes adelantado? | No se menciona. Es la pregunta que más llega por WhatsApp, debería estar en el FAQ |
| `contrato` | ¿Plazo mínimo? ¿Ciclo lectivo o mes a mes? | No se menciona |
| `lavarropas` | ¿Hay? ¿Uso incluido? | No se menciona en equipamiento hasta confirmar |
| `limpieza` | ¿Limpieza de áreas comunes incluida o a cargo de los residentes? | Se asume a cargo de los residentes, según normas |
| `visitas` | ¿Se permiten? ¿Con qué condiciones? | Se redacta una norma genérica, a confirmar |
| `normas` | Todo el reglamento es **borrador propuesto**, no el real | Debe revisarlo la familia antes de publicar |
| `nombre` | ¿Nombre propio más adelante? | Genérico. Centralizado para cambiarlo en una línea |

**Ninguna de estas bloquea el desarrollo.** Todas bloquean la publicación.

---

## 9. Entregable

Sitio estático listo para deploy, más un `README.md` escrito para alguien no
técnico, explicando cómo cambiar un teléfono, marcar una habitación como
ocupada, y reemplazar las fotos.

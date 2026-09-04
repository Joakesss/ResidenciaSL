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
    //   Mientras este vacio, el boton cae automaticamente a WhatsApp.
    urlFormulario: "",
    titulo: "Reservá tu lugar",
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
      imagen: "/img/habitacion-privada-1.svg",
    },
    {
      id: "privada-2",
      nombre: "Habitación privada individual",
      descripcion:
        "Segunda habitación individual, amoblada, con las mismas comodidades.",
      capacidad: 1,
      disponibilidad: "disponible",
      imagen: "/img/habitacion-privada-2.svg",
    },
    {
      id: "compartida",
      nombre: "Habitación compartida",
      descripcion:
        "Para dos personas, amoblada. Ideal si venís con un amigo o una amiga, o si preferís una opción más económica.",
      capacidad: 2,
      disponibilidad: "disponible",
      imagen: "/img/habitacion-compartida.svg",
    },
  ],

  // PREGUNTA(fotos): son placeholders. Reemplazar los archivos en public/img/
  //   y cambiar la extension .svg por .jpg en las rutas de abajo.
  galeria: [
    { id: "fachada", tipo: "imagen", src: "/img/fachada.svg", alt: "Frente de la residencia" },
    { id: "living", tipo: "imagen", src: "/img/living.svg", alt: "Espacio común para estar y estudiar" },
    { id: "cocina", tipo: "imagen", src: "/img/cocina.svg", alt: "Cocina compartida equipada" },
    { id: "bano", tipo: "imagen", src: "/img/bano.svg", alt: "Baño compartido" },
    { id: "privada-1", tipo: "imagen", src: "/img/habitacion-privada-1.svg", alt: "Habitación privada individual" },
    { id: "privada-2", tipo: "imagen", src: "/img/habitacion-privada-2.svg", alt: "Segunda habitación privada individual" },
    { id: "compartida", tipo: "imagen", src: "/img/habitacion-compartida.svg", alt: "Habitación compartida para dos personas" },
    { id: "patio", tipo: "imagen", src: "/img/patio.svg", alt: "Patio de la residencia" },
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
      descripcion: "Súper, farmacia y comercios para el día a día.",
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

export type Disponibilidad = "disponible" | "ocupada" | "consultar";

export interface Habitacion {
  id: string;
  nombre: string;
  descripcion: string;
  /** Cuantas personas duermen en esta habitacion. */
  capacidad: number;
  /** Texto de ocupacion para la tarjeta. Si falta, se arma con capacidad. */
  ocupacion?: string;
  disponibilidad: Disponibilidad;
  /** Ruta publica, ej. "/img/HabitacionPrivada1.jpeg". */
  imagen: string;
}

/**
 * "si"          = confirmado, incluido en el alquiler.
 * "aparte"      = confirmado, se paga por separado del alquiler: muestra "Aparte".
 * "a-confirmar" = todavia no se decidio si va incluido o se cobra aparte.
 *                 Mientras este asi, el sitio NO puede afirmar que esta
 *                 incluido: muestra "Consultar".
 */
export type EstadoInclusion = "si" | "aparte" | "a-confirmar";

export interface Servicio {
  id: string;
  nombre: string;
  detalle: string;
  incluido: EstadoInclusion;
  /** Icono inline por nombre; lo resuelve el componente Servicios. */
  icono: string;
  /** true = se muestra destacado. Reservado para diferenciales reales. */
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
  /** Fotos de la cuadra y los alrededores. */
  entorno: MediaGaleria[];
  equipamiento: ItemEquipamiento[];
  normas: Norma[];
  lugaresCercanos: LugarCercano[];
  faq: PreguntaFrecuente[];
}

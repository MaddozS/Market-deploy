export type Publicacion = {
  imagenes: File[] | string[];
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: 'producto' | 'servicio';
};

export type Facultad = {
  nombre: string;
};

export type Vendedor = {
  apellidos: string;
  idFacultad: number;
  imagen: string;
  matricula: string;
  nombres: string;
  numeroContacto: string;
  facultad: Facultad;
};

// omit images and precio
export type PublicacionEdit = Omit<Publicacion, 'imagenes' | 'precio'> & {
  imagenes: string[] | null;
  precio: string | number;
};

//
export type PublicationGet = Omit<Publicacion, 'imagenes'> & {
  imagenes: string[];
} & {
  idPublicacion: number;
};

export type PublicacionResponse = {
  publicacion: PublicationGet;
  vendedor: Vendedor;
};

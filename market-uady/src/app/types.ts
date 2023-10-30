export type Publicacion = {
  imagenes: File[] | string[];
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: 'producto' | 'servicio';
};
// omit images and precio
export type PublicacionEdit = Omit<Publicacion, 'imagenes' | 'precio'> & {
  imagenes: string[] | null;
  precio: string | number;
};

type PublicationInnerResponse = Omit<Publicacion, 'imagenes'> & {
  imagenes: string[];
};

export type PublicacionResponse = {
  publicacion: PublicationInnerResponse;
  vendedor: any;
};

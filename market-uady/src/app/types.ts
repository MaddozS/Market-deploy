export type Publicacion = {
  imagenes: File[];
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: 'producto' | 'servicio';
};

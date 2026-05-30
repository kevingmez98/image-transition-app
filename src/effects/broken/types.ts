export type Fragment = {
  // Forma
  points: Point[];

  // Posición base
  center: { x: number; y: number };
  // dirección normalizada
  direction: {
    x: number;
    y: number;
  };

  // cuánto viaja
  distance: number;
  // Animación
  velocity: { x: number; y: number };
  rotation: number;
  rotationSpeed: number;
};

export type Point = [number, number]
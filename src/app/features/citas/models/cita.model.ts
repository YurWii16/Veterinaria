export interface Cita {
  id: number;
  mascota: string;
  dueno: string;
  fecha: Date;
  hora: string;
  motivo: string;
  estado: 'pendiente' | 'completada';
  veterinario: string;
}
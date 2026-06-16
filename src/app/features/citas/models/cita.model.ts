export interface Cita {
  id: number;
  mascota: string;
  especie: string;
  dueno: string;
  fecha: Date;
  hora: string;
  motivo: string;
  estado: 'pendiente' | 'completada' | 'cancelada' | 'en espera';
  veterinario: string;
}
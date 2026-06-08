export class AtencionClinica {
  id: string;
  fecha: Date;
  motivo: string;
  diagnostico: string;
  tratamiento?: string;
  veterinario?: string;
  notas?: string;

  constructor(
    id: string,
    fecha: Date | string,
    motivo: string,
    diagnostico: string,
    tratamiento?: string,
    veterinario?: string,
    notas?: string
  ) {
    this.id = id;
    this.fecha = typeof fecha === 'string' ? new Date(fecha) : fecha;
    this.motivo = motivo;
    this.diagnostico = diagnostico;
    this.tratamiento = tratamiento;
    this.veterinario = veterinario;
    this.notas = notas;
  }

  obtenerFechaFormato(): string {
    return this.fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  estaCompletada(): boolean {
    return !!(this.motivo && this.diagnostico);
  }

  obtenerResumen(): string {
    return `${this.obtenerFechaFormato()}: ${this.motivo} - ${this.diagnostico}`;
  }
}

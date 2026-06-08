import { Injectable } from '@angular/core';
import { Cita } from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private citas: Cita[] = [];

  constructor() { }

  // Obtener todas las citas
  getCitas(): Cita[] {
    return this.citas;
  }

  // Agregar nueva cita con validación de colisión
  agregarCita(cita: Cita): void {

    const existeCruce = this.citas.some(c =>
      c.fecha === cita.fecha &&
      c.hora === cita.hora &&
      c.veterinario === cita.veterinario
    );

    if (existeCruce) {
      alert("El veterinario ya tiene una cita en ese horario ❌");
      return;
    }

    this.citas.push(cita);
  }

  // Eliminar cita
  eliminarCita(id: number): void {
    this.citas = this.citas.filter(c => c.id !== id);
  }
}
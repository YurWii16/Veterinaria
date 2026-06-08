import { Injectable } from '@angular/core';
import { Cita } from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private citas: Cita[] = [];

  getCitas(): Cita[] {
    return this.citas;
  }

  agregarCita(cita: Cita): void {
    this.citas.push(cita);
  }

  eliminarCita(id: number): void {
    this.citas = this.citas.filter(c => c.id !== id);
  }
}
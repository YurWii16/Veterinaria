import { Injectable } from '@angular/core';
import { Cita } from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private readonly STORAGE_KEY = 'vetvibe_citas';
  private citas: Cita[] = [];

  constructor() {
    this.cargarDeStorage();
  }

  private cargarDeStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        this.citas = JSON.parse(data);
      } catch (error) {
        console.error('Error al cargar citas de storage:', error);
        this.citas = [];
      }
    } else {
      this.citas = [];
    }
  }

  private guardarEnStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.citas));
  }

  // Obtener todas las citas
  getCitas(): Cita[] {
    return this.citas;
  }

  // Agregar nueva cita con validación de colisión
  agregarCita(cita: Cita): void {
    const existeCruce = this.citas.some(c =>
      c.fecha.toString() === cita.fecha.toString() &&
      c.hora === cita.hora &&
      c.veterinario === cita.veterinario
    );

    if (existeCruce) {
      alert("El veterinario ya tiene una cita en ese horario ❌");
      return;
    }

    this.citas.push(cita);
    this.guardarEnStorage();
  }

  // Actualizar estado de una cita
  actualizarEstado(id: number, nuevoEstado: 'pendiente' | 'completada' | 'cancelada' | 'en espera'): void {
    const cita = this.citas.find(c => c.id === id);
    if (cita) {
      cita.estado = nuevoEstado;
      this.guardarEnStorage();
    }
  }

  // Eliminar cita
  eliminarCita(id: number): void {
    this.citas = this.citas.filter(c => c.id !== id);
    this.guardarEnStorage();
  }
}
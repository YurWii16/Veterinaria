import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../core/services/auth';
import { MascotaService } from '../../../features/mascotas/services/mascota.service';
import { CitaService } from '../../../features/citas/services/cita.service';
import { Mascota } from '../../../features/mascotas/models';
import { Cita } from '../../../features/citas/models/cita.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: false,
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css'
})
export class DashboardHome implements OnInit {
  currentUser: User | null = null;
  
  // Real statistics linked to services
  stats = {
    totalMascotas: 0,
    citasHoy: 0,
    citasCompletadas: 0,
    alertasUrgentes: 0
  };

  mascotas: Mascota[] = [];
  citasHoy: Cita[] = [];

  constructor(
    private authService: AuthService,
    private mascotaService: MascotaService,
    private citaService: CitaService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Fetch live pets
    this.mascotaService.obtenerTodas().subscribe(list => {
      this.mascotas = list;
      this.stats.totalMascotas = list.length;
      this.recalculateStats();
    });

    // Fetch live appointments
    this.citasHoy = this.citaService.getCitas();
    this.stats.citasHoy = this.citasHoy.length;
    this.recalculateStats();
  }

  private recalculateStats(): void {
    const now = new Date().getTime();
    
    this.stats.citasCompletadas = this.citasHoy.filter(c => c.estado === 'completada').length;
    
    this.stats.alertasUrgentes = this.citasHoy.filter(c => {
      const diffMs = new Date(c.fecha).getTime() - now;
      // Urgent if pending and scheduled in the next 24 hours
      return c.estado === 'pendiente' && diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000;
    }).length;
  }

  getEspecieMascota(nombreMascota: string): string {
    const mascota = this.mascotas.find(m => m.nombre.toLowerCase() === nombreMascota.toLowerCase());
    return mascota ? mascota.especie : 'Mascota';
  }
}

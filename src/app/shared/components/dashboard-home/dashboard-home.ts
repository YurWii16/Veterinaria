import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../core/services/auth';

interface CitaMock {
  mascota: string;
  especie: string;
  propietario: string;
  fecha: Date;
  motivo: string;
  veterinario: string;
  estado: string;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: false,
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css'
})
export class DashboardHome implements OnInit {
  currentUser: User | null = null;
  
  // Mock statistics
  stats = {
    totalMascotas: 142,
    citasHoy: 3,
    citasCompletadas: 1,
    alertasUrgentes: 2
  };

  // Mock appointments to test DateFormatPipe, AppointmentStatusPipe and HighlightUpcomingDirective
  citasHoy: CitaMock[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    const now = new Date();
    
    // Appointment 1: in 3 hours (should highlight)
    const time1 = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    // Appointment 2: in 18 hours (should highlight)
    const time2 = new Date(now.getTime() + 18 * 60 * 60 * 1000);
    // Appointment 3: 4 hours ago (past, completed, should NOT highlight)
    const time3 = new Date(now.getTime() - 4 * 60 * 60 * 1000);

    this.citasHoy = [
      {
        mascota: 'Max',
        especie: 'Perro',
        propietario: 'Carlos Mendoza',
        fecha: time1,
        motivo: 'Control de vacunas anuales',
        veterinario: 'Dra. Sofía Martínez',
        estado: 'pendiente'
      },
      {
        mascota: 'Luna',
        especie: 'Gato',
        propietario: 'María Delgado',
        fecha: time2,
        motivo: 'Revisión por decaimiento',
        veterinario: 'Dr. Alejandro Bela',
        estado: 'pendiente'
      },
      {
        mascota: 'Toby',
        especie: 'Perro',
        propietario: 'Roberto Silva',
        fecha: time3,
        motivo: 'Limpieza dental de rutina',
        veterinario: 'Dr. Alejandro Bela',
        estado: 'completada'
      }
    ];
  }
}

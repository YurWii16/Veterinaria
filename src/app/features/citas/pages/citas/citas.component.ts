import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CitaFormComponent } from '../../components/cita-form/cita-form.component';
import { CitaListComponent } from '../../components/cita-list/cita-list.component';
import { Cita } from '../../models/cita.model';
import { CitaService } from '../../services/cita.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CitaFormComponent, CitaListComponent],
  templateUrl: './citas.component.html'
})
export class CitasComponent {
  citas: Cita[] = [];

  constructor(
    private citaService: CitaService,
    private router: Router
  ) {
    this.citas = this.citaService.getCitas();
  }

  agregarCita(cita: Cita) {
    console.log('Recibido en padre:', cita); 
    this.citaService.agregarCita(cita);
    this.citas = [...this.citaService.getCitas()];
    
    // Redirect to dashboard so the user sees the scheduled appointment in the dashboard summary
    this.router.navigate(['/dashboard']);
  }
  
  eliminarCita(id: number) {
    this.citaService.eliminarCita(id);
    this.citas = [...this.citaService.getCitas()];
  }

  cambiarEstadoCita(event: { id: number; estado: 'pendiente' | 'completada' | 'cancelada' | 'en espera' }) {
    this.citaService.actualizarEstado(event.id, event.estado);
    this.citas = [...this.citaService.getCitas()];
  }
}
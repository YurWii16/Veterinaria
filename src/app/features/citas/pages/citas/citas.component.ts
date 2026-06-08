import { Component } from '@angular/core';
import { CitaFormComponent } from '../../components/cita-form/cita-form.component';
import { CitaListComponent } from '../../components/cita-list/cita-list.component';
import { Cita } from '../../models/cita.model';
import { CitaService } from '../../services/cita.service';

@Component({
  selector: 'app-citas',
  imports: [CitaFormComponent, CitaListComponent],
  templateUrl: './citas.component.html'
})
export class CitasComponent {

  citas: Cita[] = [];

  constructor(private citaService: CitaService) {
    this.citas = this.citaService.getCitas();
  }

  agregarCita(cita: Cita) {
    console.log('Recibido en padre:', cita); 

    this.citaService.agregarCita(cita);
    this.citas = [...this.citaService.getCitas()];
  }
  
  eliminarCita(id: number) {
  this.citaService.eliminarCita(id);
  this.citas = [...this.citaService.getCitas()];
}
}
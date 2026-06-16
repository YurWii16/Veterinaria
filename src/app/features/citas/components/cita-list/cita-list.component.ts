import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cita } from '../../models/cita.model';
import { SharedModule } from '../../../../shared/shared-module';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './cita-list.component.html'
})
export class CitaListComponent {
  @Input() citas: Cita[] = [];
  @Output() eliminar = new EventEmitter<number>();
  @Output() cambiarEstado = new EventEmitter<{id: number, estado: 'pendiente' | 'completada' | 'cancelada' | 'en espera'}>();
}
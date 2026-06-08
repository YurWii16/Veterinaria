import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cita } from '../../models/cita.model';
import { Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cita-list.component.html'
})
export class CitaListComponent {
  @Input() citas: Cita[] = [];
  @Output() eliminar = new EventEmitter<number>();
}
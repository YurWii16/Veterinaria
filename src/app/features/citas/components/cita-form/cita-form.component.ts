import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Cita } from '../../models/cita.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cita-form.component.html'
})
export class CitaFormComponent {

  @Output() nuevaCita = new EventEmitter<Cita>();

  citaForm: FormGroup;
  veterinarios: string[] = ['Dr. Pérez', 'Dra. López', 'Dr. García'];

  constructor(private fb: FormBuilder) {
    this.citaForm = this.fb.group({
      mascota: ['', Validators.required],
      dueno: ['', Validators.required],
      veterinario: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  guardar() {
    if (this.citaForm.valid) {

      const cita: Cita = {
        id: Date.now(),
        ...this.citaForm.value,
        estado: 'pendiente'
      };

      console.log('Cita creada:', cita);

      this.nuevaCita.emit(cita);
      this.citaForm.reset();
    }
  }
}
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Cita } from '../../models/cita.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cita-form.component.html'
})
export class CitaFormComponent implements OnInit {
  @Output() nuevaCita = new EventEmitter<Cita>();

  citaForm: FormGroup;
  veterinarios: string[] = ['Dr. Alejandro Bela', 'Dra. Sofía Martínez', 'Dr. García'];
  especies: string[] = ['Canino', 'Felino', 'Ave', 'Reptil', 'Roedor', 'Exótico', 'Otro'];

  constructor(private fb: FormBuilder) {
    this.citaForm = this.fb.group({
      mascota: ['', Validators.required],
      especie: ['', Validators.required],
      dueno: ['', Validators.required],
      veterinario: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  guardar() {
    if (this.citaForm.valid) {
      const formValue = this.citaForm.getRawValue();
      
      // Combine date and time strings into a single Date object
      const fullDateTime = new Date(`${formValue.fecha}T${formValue.hora}`);
      
      const cita: Cita = {
        id: Date.now(),
        ...formValue,
        fecha: fullDateTime,
        estado: 'pendiente'
      };

      console.log('Cita creada:', cita);

      this.nuevaCita.emit(cita);
      this.citaForm.reset({
        mascota: '',
        especie: '',
        dueno: '',
        veterinario: '',
        fecha: '',
        hora: '',
        motivo: ''
      });
    }
  }
}
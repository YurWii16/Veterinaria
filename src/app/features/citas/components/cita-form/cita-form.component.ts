import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Cita } from '../../models/cita.model';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../../mascotas/services/mascota.service';
import { Mascota } from '../../../mascotas/models';

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
  mascotas: Mascota[] = [];

  constructor(
    private fb: FormBuilder,
    private mascotaService: MascotaService
  ) {
    this.citaForm = this.fb.group({
      mascota: ['', Validators.required],
      dueno: [{ value: '', disabled: true }, Validators.required], // Disabled because it's auto-populated
      veterinario: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load pets from MascotaService
    this.mascotaService.obtenerTodas().subscribe({
      next: (list) => {
        this.mascotas = list;
      },
      error: (err) => console.error('Error al cargar mascotas en formulario de citas:', err)
    });

    // Auto-populate owner when a pet is selected
    this.citaForm.get('mascota')?.valueChanges.subscribe(petName => {
      const selectedPet = this.mascotas.find(m => m.nombre === petName);
      if (selectedPet) {
        this.citaForm.get('dueno')?.setValue(selectedPet.duenoNombre);
      } else {
        this.citaForm.get('dueno')?.setValue('');
      }
    });
  }

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
        dueno: '',
        veterinario: '',
        fecha: '',
        hora: '',
        motivo: ''
      });
    }
  }
}
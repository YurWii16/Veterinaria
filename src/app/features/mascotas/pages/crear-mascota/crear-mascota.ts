import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MascotaService } from '../../services/mascota.service';
import { Mascota, Especie, EspecieLabel } from '../../models';

@Component({
  selector: 'app-crear-mascota',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-mascota.html',
  styleUrl: './crear-mascota.css',
})
export class CrearMascotaComponent implements OnInit {
  formulario!: FormGroup;
  enviando = false;
  mensaje = '';
  tipoMensaje: 'success' | 'error' = 'success';

  Especie = Especie;
  EspecieLabel = EspecieLabel;
  especies = Object.values(Especie);

  esEdicion = false;
  mascotaId: string | null = null;
  historialClinicoExistente: any[] = [];

  constructor(
    private fb: FormBuilder,
    private mascotaService: MascotaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.mascotaId = id;
        this.cargarMascota(id);
      }
    });
  }

  private cargarMascota(id: string): void {
    this.mascotaService.obtenerPorId(id).subscribe({
      next: (mascota) => {
        if (mascota) {
          this.historialClinicoExistente = mascota.historialClinico || [];
          let fechaFormateada = '';
          if (mascota.fechaNacimiento) {
            const d = new Date(mascota.fechaNacimiento);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            fechaFormateada = `${year}-${month}-${day}`;
          }
          this.formulario.patchValue({
            nombre: mascota.nombre,
            especie: mascota.especie,
            raza: mascota.raza,
            fechaNacimiento: fechaFormateada,
            pesoKg: mascota.pesoKg,
            duenoNombre: mascota.duenoNombre,
            telefonoContacto: mascota.telefonoContacto,
            observaciones: mascota.observaciones,
          });
        }
      },
      error: (error) => console.error('Error al cargar mascota para editar:', error),
    });
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      especie: ['', Validators.required],
      raza: ['', [Validators.required, Validators.minLength(2)]],
      fechaNacimiento: ['', [Validators.required, this.validarFechaNoFutura()]],
      pesoKg: ['', [Validators.required, Validators.min(0.5), Validators.max(200)]],
      duenoNombre: ['', [Validators.required, Validators.minLength(3)]],
      telefonoContacto: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{9,}$/)]],
      observaciones: [''],
    });
  }

  private validarFechaNoFutura() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const fecha = new Date(control.value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      return fecha > hoy ? { fechaFutura: true } : null;
    };
  }

  get nombre() {
    return this.formulario.get('nombre');
  }

  get especie() {
    return this.formulario.get('especie');
  }

  get raza() {
    return this.formulario.get('raza');
  }

  get fechaNacimiento() {
    return this.formulario.get('fechaNacimiento');
  }

  get pesoKg() {
    return this.formulario.get('pesoKg');
  }

  get duenoNombre() {
    return this.formulario.get('duenoNombre');
  }

  get telefonoContacto() {
    return this.formulario.get('telefonoContacto');
  }

  get observaciones() {
    return this.formulario.get('observaciones');
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    this.enviando = true;
    this.mensaje = '';

    const mascotaData = {
      nombre: this.formulario.value.nombre,
      especie: this.formulario.value.especie,
      raza: this.formulario.value.raza,
      fechaNacimiento: new Date(this.formulario.value.fechaNacimiento),
      pesoKg: parseFloat(this.formulario.value.pesoKg),
      historialClinico: this.historialClinicoExistente,
      duenoNombre: this.formulario.value.duenoNombre,
      telefonoContacto: this.formulario.value.telefonoContacto,
      observaciones: this.formulario.value.observaciones,
    };

    if (this.esEdicion && this.mascotaId) {
      this.mascotaService.actualizar(this.mascotaId, mascotaData as any).subscribe({
        next: (mascota) => {
          this.tipoMensaje = 'success';
          this.mensaje = `✅ ${mascota.nombre} actualizada exitosamente`;
          setTimeout(() => {
            this.router.navigate(['/dashboard/mascotas']);
          }, 1500);
        },
        error: (error) => {
          this.enviando = false;
          this.tipoMensaje = 'error';
          this.mensaje = `❌ Error: ${error.message || 'No se pudo actualizar la mascota'}`;
        },
      });
    } else {
      this.mascotaService.crear(mascotaData as any).subscribe({
        next: (mascota) => {
          this.tipoMensaje = 'success';
          this.mensaje = `✅ ${mascota.nombre} registrada exitosamente`;
          setTimeout(() => {
            this.router.navigate(['/dashboard/mascotas']);
          }, 1500);
        },
        error: (error) => {
          this.enviando = false;
          this.tipoMensaje = 'error';
          this.mensaje = `❌ Error: ${error.message || 'No se pudo registrar la mascota'}`;
        },
      });
    }
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.formulario.controls).forEach((key) => {
      this.formulario.get(key)?.markAsTouched();
    });
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/mascotas']);
  }

  obtenerErrorMensaje(control: any): string {
    if (!control?.errors || !control?.touched) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['minlength']) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }
    if (control.errors['min']) return `Valor mínimo: ${control.errors['min'].min}`;
    if (control.errors['max']) return `Valor máximo: ${control.errors['max'].max}`;
    if (control.errors['pattern']) return 'Formato inválido (teléfono: 9+ dígitos)';
    if (control.errors['fechaFutura']) return 'La fecha no puede ser en el futuro';
    return 'Campo inválido';
  }
}


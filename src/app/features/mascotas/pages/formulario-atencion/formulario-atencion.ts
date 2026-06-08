import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MascotaService } from '../../services/mascota.service';
import { AtencionClinica } from '../../models';

@Component({
  selector: 'app-formulario-atencion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-atencion.html',
  styleUrl: './formulario-atencion.css',
})
export class FormularioAtencionComponent implements OnInit {
  @Input() mascotaId!: string;
  @Output() atenciónAgregada = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  formulario!: FormGroup;
  enviando = false;
  mensaje = '';
  tipoMensaje: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private mascotaService: MascotaService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      motivo: ['', [Validators.required, Validators.minLength(5)]],
      diagnostico: ['', [Validators.required, Validators.minLength(5)]],
      tratamiento: ['', [Validators.required, Validators.minLength(5)]],
      veterinario: [''],
      notas: [''],
    });
  }

  get motivo() {
    return this.formulario.get('motivo');
  }

  get diagnostico() {
    return this.formulario.get('diagnostico');
  }

  get tratamiento() {
    return this.formulario.get('tratamiento');
  }

  get veterinario() {
    return this.formulario.get('veterinario');
  }

  get notas() {
    return this.formulario.get('notas');
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    this.enviando = true;
    this.mensaje = '';

    const nuevaAtencion = new AtencionClinica(
      `aten-${Date.now()}`,
      new Date(),
      this.formulario.value.motivo,
      this.formulario.value.diagnostico,
      this.formulario.value.tratamiento,
      this.formulario.value.veterinario,
      this.formulario.value.notas
    );

    this.mascotaService
      .agregarAtencionClinica(this.mascotaId, nuevaAtencion)
      .subscribe({
        next: () => {
          this.tipoMensaje = 'success';
          this.mensaje = '✅ Atención registrada exitosamente';
          setTimeout(() => {
            this.atenciónAgregada.emit();
          }, 1500);
        },
        error: (error) => {
          this.enviando = false;
          this.tipoMensaje = 'error';
          this.mensaje = `❌ Error: ${error.message || 'No se pudo registrar la atención'}`;
        },
      });
  }

  cancelar(): void {
    this.cancelado.emit();
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.formulario.controls).forEach((key) => {
      this.formulario.get(key)?.markAsTouched();
    });
  }

  obtenerErrorMensaje(control: any): string {
    if (!control?.errors || !control?.touched) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['minlength']) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }
    return 'Campo inválido';
  }
}


import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MascotaService } from '../../services/mascota.service';
import { Mascota, EspecieLabel } from '../../models';
import { FormularioAtencionComponent } from '../formulario-atencion/formulario-atencion';
import { ReversePipe } from '../../../../shared/pipes/reverse';

@Component({
  selector: 'app-detalles-mascota',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormularioAtencionComponent,
    ReversePipe,
  ],
  templateUrl: './detalles-mascota.html',
  styleUrl: './detalles-mascota.css',
})
export class DetallesMascotaComponent implements OnInit, OnDestroy {
  mascota: Mascota | null = null;
  mascotaId: string | null = null;
  mostrarFormularioAtencion = false;

  EspecieLabel = EspecieLabel;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private mascotaService: MascotaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.mascotaId = id;
        this.cargarMascota(id);
      }
    });
  }

  private cargarMascota(id: string): void {
    this.mascotaService
      .obtenerPorId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (mascota) => {
          if (!mascota) {
            this.router.navigate(['/dashboard/mascotas']);
          } else {
            this.mascota = mascota;
          }
        },
        error: () => {
          this.router.navigate(['/dashboard/mascotas']);
        },
      });
  }

  obtenerEstadoColor(): string {
    if (!this.mascota) return 'secondary';
    const estado = this.mascota.obtenerEstadoSalud();
    return estado === 'bueno' ? 'success' : estado === 'revisar' ? 'warning' : 'danger';
  }

  abrirFormularioAtencion(): void {
    this.mostrarFormularioAtencion = true;
  }

  cerrarFormularioAtencion(): void {
    this.mostrarFormularioAtencion = false;
  }

  onAtencionAgregada(): void {
    this.cerrarFormularioAtencion();
    if (this.mascotaId) {
      this.cargarMascota(this.mascotaId);
    }
  }

  editarMascota(): void {
    if (this.mascotaId) {
      this.router.navigate(['/dashboard/mascotas/editar', this.mascotaId]);
    }
  }

  eliminarMascota(): void {
    if (!this.mascota || !confirm(`¿Eliminar a ${this.mascota.nombre}?`)) {
      return;
    }

    this.mascotaService
      .eliminar(this.mascota.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard/mascotas']);
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
        },
      });
  }

  volver(): void {
    this.router.navigate(['/dashboard/mascotas']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MascotaService } from '../../services/mascota.service';
import { Mascota, Especie, EspecieLabel } from '../../models';

@Component({
  selector: 'app-lista-mascotas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './lista-mascotas.component.html',
  styleUrl: './lista-mascotas.css',
})
export class ListaMascotasComponent implements OnInit, OnDestroy {
  mascotas$!: Observable<Mascota[]>;
  mascotasFiltradas: Mascota[] = [];
  totalMascotas = 0;

  buscadorControl = new FormControl('');
  especieControl = new FormControl('');
  duenoControl = new FormControl('');

  Especie = Especie;
  EspecieLabel = EspecieLabel;
  especies = Object.values(Especie);

  private destroy$ = new Subject<void>();

  constructor(private mascotaService: MascotaService) {}

  ngOnInit(): void {
    this.mascotas$ = this.mascotaService.obtenerTodas();

    this.mascotas$.pipe(takeUntil(this.destroy$)).subscribe((mascotas) => {
      this.mascotasFiltradas = mascotas;
      this.totalMascotas = mascotas.length;
      this.aplicarFiltros();
    });

    this.buscadorControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.aplicarFiltros());

    this.especieControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.aplicarFiltros());

    this.duenoControl.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => this.aplicarFiltros());
  }

  private aplicarFiltros(): void {
    const nombre = this.buscadorControl.value?.trim() || '';
    const especie = this.especieControl.value as Especie | '';
    const dueno = this.duenoControl.value?.trim() || '';

    this.mascotaService
      .buscarAvanzada({
        nombre: nombre || undefined,
        especie: especie || undefined,
        duenoNombre: dueno || undefined,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((mascotas) => {
        this.mascotasFiltradas = mascotas;
      });
  }

  obtenerEstadoColor(mascota: Mascota): string {
    const estado = mascota.obtenerEstadoSalud();
    return estado === 'bueno' ? 'success' : estado === 'revisar' ? 'warning' : 'danger';
  }

  eliminarMascota(id: string, nombre: string): void {
    if (confirm(`¿Eliminar a ${nombre}?`)) {
      this.mascotaService
        .eliminar(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (error) => console.error('Error al eliminar:', error),
        });
    }
  }

  limpiarFiltros(): void {
    this.buscadorControl.reset();
    this.especieControl.reset();
    this.duenoControl.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
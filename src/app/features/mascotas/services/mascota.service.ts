import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Mascota, AtencionClinica, Especie, Perro, Gato, Ave, Exotico } from '../models';

@Injectable({
  providedIn: 'root',
})
export class MascotaService {
  private readonly STORAGE_KEY = 'vetvibe_mascotas';
  private mascotasSubject = new BehaviorSubject<Mascota[]>([]);
  public mascotas$ = this.mascotasSubject.asObservable();

  constructor() {
    this.inicializar();
  }

  private inicializar(): void {
    const mascotasGuardadas = this.cargarDelStorage();
    this.mascotasSubject.next(mascotasGuardadas);
  }

  private cargarDelStorage(): Mascota[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        const mascotasData = JSON.parse(data);
        return mascotasData.map((m: any) => this.deserializarMascota(m));
      } catch (error) {
        console.error('Error al cargar mascotas del storage:', error);
        return this.crearDatosInicial();
      }
    }
    return this.crearDatosInicial();
  }

  private deserializarMascota(data: any): Mascota {
    const historialClinico = (data.historialClinico ?? []).map(
      (h: any) =>
        new AtencionClinica(
          h.id,
          new Date(h.fecha),
          h.motivo,
          h.diagnostico,
          h.tratamiento,
          h.veterinario,
          h.notas
        )
    );

    return this.fabricaMascota(
      data.id,
      data.nombre,
      data.especie,
      data.raza,
      new Date(data.fechaNacimiento),
      data.pesoKg,
      historialClinico,
      data.duenoNombre,
      data.telefonoContacto,
      data.observaciones
    );
  }

  private fabricaMascota(
    id: string,
    nombre: string,
    especie: Especie,
    raza: string,
    fechaNacimiento: Date,
    pesoKg: number,
    historialClinico: AtencionClinica[],
    duenoNombre?: string,
    telefonoContacto?: string,
    observaciones?: string
  ): Mascota {
    switch (especie) {
      case Especie.CANINO:
        return new Perro(
          id,
          nombre,
          especie,
          raza,
          fechaNacimiento,
          pesoKg,
          historialClinico,
          duenoNombre,
          telefonoContacto,
          observaciones
        );
      case Especie.FELINO:
        return new Gato(
          id,
          nombre,
          especie,
          raza,
          fechaNacimiento,
          pesoKg,
          historialClinico,
          duenoNombre,
          telefonoContacto,
          observaciones
        );
      case Especie.AVE:
        return new Ave(
          id,
          nombre,
          especie,
          raza,
          fechaNacimiento,
          pesoKg,
          historialClinico,
          duenoNombre,
          telefonoContacto,
          observaciones
        );
      case Especie.EXOTICO:
        return new Exotico(
          id,
          nombre,
          especie,
          raza,
          fechaNacimiento,
          pesoKg,
          historialClinico,
          duenoNombre,
          telefonoContacto,
          observaciones
        );
      default:
        return new Perro(
          id,
          nombre,
          especie,
          raza,
          fechaNacimiento,
          pesoKg,
          historialClinico,
          duenoNombre,
          telefonoContacto,
          observaciones
        );
    }
  }

  private crearDatosInicial(): Mascota[] {
    const mascotasDefault = [
      new Perro(
        this.generarId(),
        'Firulais',
        Especie.CANINO,
        'Mestizo',
        new Date('2020-05-10'),
        15.5,
        [
          new AtencionClinica(
            this.generarId(),
            new Date('2024-11-15'),
            'Revisión general',
            'Sin anomalías',
            undefined,
            'Dr. García'
          ),
        ],
        'Juan Pérez',
        '+34 612345678'
      ),
      new Gato(
        this.generarId(),
        'Minina',
        Especie.FELINO,
        'Persa',
        new Date('2022-03-20'),
        4.2,
        [],
        'María López',
        '+34 687654321'
      ),
    ];

    this.guardarEnStorage(mascotasDefault);
    return mascotasDefault;
  }

  private guardarEnStorage(mascotas: Mascota[]): void {
    const mascotasSerializadas = mascotas.map((m) => ({
      id: m.id,
      nombre: m.nombre,
      especie: m.especie,
      raza: m.raza,
      fechaNacimiento: m.fechaNacimiento.toISOString(),
      pesoKg: m.pesoKg,
      historialClinico: m.historialClinico.map((h) => ({
        id: h.id,
        fecha: h.fecha.toISOString(),
        motivo: h.motivo,
        diagnostico: h.diagnostico,
        tratamiento: h.tratamiento,
        veterinario: h.veterinario,
        notas: h.notas,
      })),
      duenoNombre: m.duenoNombre,
      telefonoContacto: m.telefonoContacto,
      observaciones: m.observaciones,
    }));

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mascotasSerializadas));
  }

  private emitirCambios(mascotas: Mascota[]): void {
    this.mascotasSubject.next(mascotas);
    this.guardarEnStorage(mascotas);
  }

  private generarId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  crear(mascota: Omit<Mascota, 'id'>): Observable<Mascota> {
    return new Observable((observer) => {
      try {
        const mascotaConId = this.fabricaMascota(
          this.generarId(),
          mascota.nombre,
          mascota.especie,
          mascota.raza,
          mascota.fechaNacimiento,
          mascota.pesoKg,
          mascota.historialClinico,
          mascota.duenoNombre,
          mascota.telefonoContacto,
          mascota.observaciones
        );

        const mascotasActuales = this.mascotasSubject.value;
        this.emitirCambios([...mascotasActuales, mascotaConId]);
        observer.next(mascotaConId);
        observer.complete();
      } catch (error) {
        observer.error(
          error instanceof Error
            ? error
            : new Error('Error al crear mascota')
        );
      }
    });
  }

  obtenerTodas(): Observable<Mascota[]> {
    return this.mascotas$;
  }

  obtenerPorId(id: string): Observable<Mascota | undefined> {
    return new Observable((observer) => {
      const mascota = this.mascotasSubject.value.find((m) => m.id === id);
      observer.next(mascota);
      observer.complete();
    });
  }

  actualizar(id: string, cambios: Partial<Mascota>): Observable<Mascota> {
    return new Observable((observer) => {
      try {
        const mascotasActuales = this.mascotasSubject.value;
        const indice = mascotasActuales.findIndex((m) => m.id === id);

        if (indice === -1) {
          throw new Error(`Mascota con ID ${id} no encontrada`);
        }

        const mascotaActual = mascotasActuales[indice];
        const mascotaActualizada = this.fabricaMascota(
          mascotaActual.id,
          cambios.nombre ?? mascotaActual.nombre,
          cambios.especie ?? mascotaActual.especie,
          cambios.raza ?? mascotaActual.raza,
          cambios.fechaNacimiento ?? mascotaActual.fechaNacimiento,
          cambios.pesoKg ?? mascotaActual.pesoKg,
          cambios.historialClinico ?? mascotaActual.historialClinico,
          cambios.duenoNombre ?? mascotaActual.duenoNombre,
          cambios.telefonoContacto ?? mascotaActual.telefonoContacto,
          cambios.observaciones ?? mascotaActual.observaciones
        );

        const mascotasActualizadas = [
          ...mascotasActuales.slice(0, indice),
          mascotaActualizada,
          ...mascotasActuales.slice(indice + 1),
        ];

        this.emitirCambios(mascotasActualizadas);
        observer.next(mascotaActualizada);
        observer.complete();
      } catch (error) {
        observer.error(
          error instanceof Error
            ? error
            : new Error('Error al actualizar mascota')
        );
      }
    });
  }

  eliminar(id: string): Observable<boolean> {
    return new Observable((observer) => {
      try {
        const mascotasActuales = this.mascotasSubject.value;
        const mascotasFiltradas = mascotasActuales.filter((m) => m.id !== id);

        if (mascotasFiltradas.length === mascotasActuales.length) {
          throw new Error(`Mascota con ID ${id} no encontrada`);
        }

        this.emitirCambios(mascotasFiltradas);
        observer.next(true);
        observer.complete();
      } catch (error) {
        observer.error(
          error instanceof Error
            ? error
            : new Error('Error al eliminar mascota')
        );
      }
    });
  }

  buscarPorNombre(nombre: string): Observable<Mascota[]> {
    return new Observable((observer) => {
      const termino = nombre.toLowerCase().trim();
      if (!termino) {
        observer.next(this.mascotasSubject.value);
      } else {
        const resultados = this.mascotasSubject.value.filter((m) =>
          m.nombre.toLowerCase().includes(termino)
        );
        observer.next(resultados);
      }
      observer.complete();
    });
  }

  filtrarPorEspecie(especie: Especie): Observable<Mascota[]> {
    return new Observable((observer) => {
      const resultados = this.mascotasSubject.value.filter(
        (m) => m.especie === especie
      );
      observer.next(resultados);
      observer.complete();
    });
  }

  filtrarPorDueno(duenoNombre: string): Observable<Mascota[]> {
    return new Observable((observer) => {
      const termino = duenoNombre.toLowerCase().trim();
      const resultados = this.mascotasSubject.value.filter(
        (m) =>
          m.duenoNombre?.toLowerCase().includes(termino) ?? false
      );
      observer.next(resultados);
      observer.complete();
    });
  }

  buscarAvanzada(criterios: {
    nombre?: string;
    especie?: Especie;
    duenoNombre?: string;
    edadMinima?: number;
    edadMaxima?: number;
  }): Observable<Mascota[]> {
    return new Observable((observer) => {
      let resultados = this.mascotasSubject.value;

      if (criterios.nombre) {
        const termino = criterios.nombre.toLowerCase();
        resultados = resultados.filter((m) =>
          m.nombre.toLowerCase().includes(termino)
        );
      }

      if (criterios.especie) {
        resultados = resultados.filter((m) => m.especie === criterios.especie);
      }

      if (criterios.duenoNombre) {
        const termino = criterios.duenoNombre.toLowerCase();
        resultados = resultados.filter(
          (m) =>
            m.duenoNombre?.toLowerCase().includes(termino) ?? false
        );
      }

      if (criterios.edadMinima !== undefined) {
        resultados = resultados.filter(
          (m) => m.calcularEdad() >= criterios.edadMinima!
        );
      }

      if (criterios.edadMaxima !== undefined) {
        resultados = resultados.filter(
          (m) => m.calcularEdad() <= criterios.edadMaxima!
        );
      }

      observer.next(resultados);
      observer.complete();
    });
  }

  obtenerTotal(): Observable<number> {
    return new Observable((observer) => {
      observer.next(this.mascotasSubject.value.length);
      observer.complete();
    });
  }

  obtenerMascotasQueNecesitanRevision(): Observable<Mascota[]> {
    return new Observable((observer) => {
      const resultados = this.mascotasSubject.value.filter((m) =>
        m.necesitaRevisionPorEdad()
      );
      observer.next(resultados);
      observer.complete();
    });
  }

  agregarAtencionClinica(
    mascotaId: string,
    atencion: AtencionClinica
  ): Observable<Mascota> {
    return new Observable((observer) => {
      try {
        const mascotasActuales = this.mascotasSubject.value;
        const indice = mascotasActuales.findIndex((m) => m.id === mascotaId);

        if (indice === -1) {
          throw new Error(`Mascota con ID ${mascotaId} no encontrada`);
        }

        const mascota = mascotasActuales[indice];
        mascota.agregarAtencionClinica(atencion);

        const mascotasActualizadas = [...mascotasActuales];
        this.emitirCambios(mascotasActualizadas);
        observer.next(mascota);
        observer.complete();
      } catch (error) {
        observer.error(
          error instanceof Error
            ? error
            : new Error('Error al agregar atención clínica')
        );
      }
    });
  }

  limpiarDatos(): Observable<boolean> {
    return new Observable((observer) => {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
        this.mascotasSubject.next([]);
        observer.next(true);
        observer.complete();
      } catch (error) {
        observer.error(
          error instanceof Error
            ? error
            : new Error('Error al limpiar datos')
        );
      }
    });
  }
}

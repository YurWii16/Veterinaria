import { AtencionClinica } from './atencion-clinica';
import { Especie } from './especie.enum';

export class Mascota {
  id: string;
  nombre: string;
  especie: Especie;
  raza: string;
  fechaNacimiento: Date;
  pesoKg: number;
  historialClinico: AtencionClinica[];
  duenoNombre?: string;
  telefonoContacto?: string;
  observaciones?: string;

  constructor(
    id: string,
    nombre: string,
    especie: Especie,
    raza: string,
    fechaNacimiento: Date | string,
    pesoKg: number,
    historialClinico?: AtencionClinica[],
    duenoNombre?: string,
    telefonoContacto?: string,
    observaciones?: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.especie = especie;
    this.raza = raza;
    this.fechaNacimiento =
      typeof fechaNacimiento === 'string'
        ? new Date(fechaNacimiento)
        : fechaNacimiento;
    this.pesoKg = pesoKg;
    this.historialClinico = historialClinico ?? [];
    this.duenoNombre = duenoNombre;
    this.telefonoContacto = telefonoContacto;
    this.observaciones = observaciones;
  }

  calcularEdad(): number {
    const hoy = new Date();
    let edad = hoy.getFullYear() - this.fechaNacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = this.fechaNacimiento.getMonth();

    if (
      mesActual < mesNacimiento ||
      (mesActual === mesNacimiento &&
        hoy.getDate() < this.fechaNacimiento.getDate())
    ) {
      edad--;
    }

    return Math.max(0, edad);
  }

  calcularEdadEnMeses(): number {
    const hoy = new Date();
    let meses =
      (hoy.getFullYear() - this.fechaNacimiento.getFullYear()) * 12;
    meses += hoy.getMonth() - this.fechaNacimiento.getMonth();

    if (hoy.getDate() < this.fechaNacimiento.getDate()) {
      meses--;
    }

    return Math.max(0, meses);
  }

  obtenerFechaNacimientoFormato(): string {
    return this.fechaNacimiento.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  obtenerDescripcionEdad(): string {
    const años = this.calcularEdad();
    const meses = this.calcularEdadEnMeses() % 12;

    if (años === 0) {
      return meses === 1 ? `${meses} mes` : `${meses} meses`;
    }

    const parteAños = años === 1 ? `${años} año` : `${años} años`;
    if (meses === 0) return parteAños;

    const partesMeses = meses === 1 ? `${meses} mes` : `${meses} meses`;
    return `${parteAños} y ${partesMeses}`;
  }

  esMayorDe(años: number): boolean {
    return this.calcularEdad() >= años;
  }

  necesitaRevisionPorEdad(): boolean {
    return this.esMayorDe(7);
  }

  agregarAtencionClinica(atencion: AtencionClinica): void {
    this.historialClinico.push(atencion);
  }

  obtenerUltimaAtencion(): AtencionClinica | undefined {
    if (this.historialClinico.length === 0) return undefined;
    return this.historialClinico[this.historialClinico.length - 1];
  }

  obtenerAtencionesPorRango(
    fechaInicio: Date,
    fechaFin: Date
  ): AtencionClinica[] {
    return this.historialClinico.filter(
      (atencion) =>
        atencion.fecha >= fechaInicio && atencion.fecha <= fechaFin
    );
  }

  calcularIndiceMasaCorporal(): number {
    const alturaEstimada = 0.5;
    return this.pesoKg / (alturaEstimada * alturaEstimada);
  }

  obtenerEstadoSalud(): 'bueno' | 'revisar' | 'crítico' {
    const imc = this.calcularIndiceMasaCorporal();
    const edad = this.calcularEdad();

    if (imc > 30 || imc < 15 || edad > 12) {
      return 'revisar';
    }

    if (this.obtenerUltimaAtencion() === undefined && edad > 1) {
      return 'revisar';
    }

    return 'bueno';
  }

  obtenerResumen(): string {
    return `${this.nombre} (${this.especie}) - ${this.obtenerDescripcionEdad()}`;
  }
}

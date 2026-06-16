import { AtencionClinica } from './atencion-clinica';
import { Especie } from './especie.enum';
import { Mascota } from './mascota';

export class Perro extends Mascota {
  requiereCuidadosEspeciales(): boolean {
    const edad = this.calcularEdad();
    const tieneAlergias = this.observaciones?.toLowerCase().includes('alergia') ?? false;
    const esRazaGrande = this.pesoKg > 25;

    return edad > 6 || tieneAlergias || esRazaGrande;
  }
}

export class Gato extends Mascota {
  requiereCuidadosEspeciales(): boolean {
    const edad = this.calcularEdad();
    const esteRilizado = this.observaciones?.toLowerCase().includes('esterilizado') ?? false;
    const tieneProblemasRenales = this.observaciones?.toLowerCase().includes('renal') ?? false;

    return !esteRilizado && edad > 1 || tieneProblemasRenales || edad > 10;
  }
}

export class Ave extends Mascota {
  requiereCuidadosEspeciales(): boolean {
    const edad = this.calcularEdad();
    const requiereJaulaEspecial = ['loro', 'guacamayo', 'periquito'].some(
      (tipo) => this.raza.toLowerCase().includes(tipo)
    );

    return requiereJaulaEspecial || edad < 1;
  }
}

export class Exotico extends Mascota {
  requiereCuidadosEspeciales(): boolean {
    return true;
  }
}

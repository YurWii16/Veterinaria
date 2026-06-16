import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appointmentStatus',
  standalone: false
})
export class AppointmentStatusPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return 'Sin Estado';

    const normalizedValue = value.toLowerCase().trim();

    switch (normalizedValue) {
      case 'pendiente':
        return 'Pendiente';
      case 'completada':
        return 'Completada';
      case 'cancelada':
        return 'Cancelada';
      case 'en espera':
        return 'En Espera';
      default:
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
}

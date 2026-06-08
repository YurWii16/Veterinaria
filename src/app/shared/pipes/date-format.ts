import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: false
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date | undefined | null): string {
    if (!value) return '-';

    const date = new Date(value);
    
    // Check if valid date
    if (isNaN(date.getTime())) return '-';

    try {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };

      const formatter = new Intl.DateTimeFormat('es-ES', options);
      const formatted = formatter.format(date);
      
      // Capitalize the first letter (e.g. "sábado" -> "Sábado")
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch (error) {
      return date.toLocaleDateString();
    }
  }
}

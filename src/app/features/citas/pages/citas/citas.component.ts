import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CitaFormComponent } from '../../components/cita-form/cita-form.component';
import { CitaListComponent } from '../../components/cita-list/cita-list.component';
import { Cita } from '../../models/cita.model';
import { CitaService } from '../../services/cita.service';
import { MascotaService } from '../../../mascotas/services/mascota.service';
import { Especie } from '../../../mascotas/models';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CitaFormComponent, CitaListComponent],
  templateUrl: './citas.component.html'
})
export class CitasComponent {
  citas: Cita[] = [];

  constructor(
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private router: Router
  ) {
    this.citas = this.citaService.getCitas();
  }

  agregarCita(cita: Cita) {
    console.log('Recibido en padre:', cita); 
    this.citaService.agregarCita(cita);
    this.citas = [...this.citaService.getCitas()];
    
    // Auto-register pet in patient directory if it doesn't exist
    this.mascotaService.obtenerTodas().subscribe(mascotas => {
      const existe = mascotas.some(m => m.nombre.toLowerCase() === cita.mascota.toLowerCase());
      if (!existe) {
        let especieEnum = Especie.CANINO; // default
        const especieLower = (cita.especie || '').toLowerCase();
        if (especieLower === 'felino') especieEnum = Especie.FELINO;
        else if (especieLower === 'ave') especieEnum = Especie.AVE;
        else if (especieLower === 'reptil') especieEnum = Especie.REPTIL;
        else if (especieLower === 'roedor') especieEnum = Especie.ROEDOR;
        else if (especieLower === 'exótico' || especieLower === 'exotico') especieEnum = Especie.EXOTICO;

        this.mascotaService.crear({
          nombre: cita.mascota,
          especie: especieEnum,
          raza: 'Mestizo',
          fechaNacimiento: new Date(),
          pesoKg: 5.0,
          historialClinico: [],
          duenoNombre: cita.dueno,
          telefonoContacto: '+34 600000000',
          observaciones: 'Registrado automáticamente al agendar cita.'
        } as any).subscribe({
          next: (m) => console.log('Mascota registrada automáticamente:', m),
          error: (err) => console.error('Error al registrar mascota automáticamente:', err)
        });
      }
    });

    // Ask user to print PDF ticket
    if (confirm('Cita agendada con éxito. ¿Deseas imprimir el comprobante en PDF?')) {
      this.imprimirTicket(cita);
    }
    
    // Redirect to dashboard
    this.router.navigate(['/dashboard']);
  }
  
  imprimirTicket(cita: Cita): void {
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (!printWindow) return;

    const fechaFormateada = new Date(cita.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    printWindow.document.write(`
      <html>
      <head>
        <title>Ticket de Cita - VetVibe</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            padding: 40px;
            max-width: 500px;
            margin: 0 auto;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #14b8a6;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #14b8a6;
          }
          .title {
            font-size: 18px;
            margin-top: 10px;
            color: #555;
          }
          .details {
            font-size: 14px;
            line-height: 1.8;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dashed #eee;
            padding: 8px 0;
          }
          .label {
            font-weight: bold;
            color: #666;
          }
          .value {
            color: #222;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #888;
            border-top: 1px solid #eee;
            padding-top: 15px;
          }
          @media print {
            body {
              border: none;
              box-shadow: none;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🐾 VetVibe</div>
          <div class="title">Confirmación de Cita</div>
        </div>
        <div class="details">
          <div class="detail-row">
            <span class="label">Mascota:</span>
            <span class="value">${cita.mascota} (${cita.especie})</span>
          </div>
          <div class="detail-row">
            <span class="label">Dueño:</span>
            <span class="value">${cita.dueno}</span>
          </div>
          <div class="detail-row">
            <span class="label">Veterinario:</span>
            <span class="value">${cita.veterinario}</span>
          </div>
          <div class="detail-row">
            <span class="label">Fecha:</span>
            <span class="value">${fechaFormateada}</span>
          </div>
          <div class="detail-row">
            <span class="label">Hora:</span>
            <span class="value">${cita.hora}</span>
          </div>
          <div class="detail-row">
            <span class="label">Motivo:</span>
            <span class="value">${cita.motivo}</span>
          </div>
        </div>
        <div class="footer">
          <p>Gracias por confiar en VetVibe 🐾</p>
          <p>Por favor, llegue 10 minutos antes de su cita.</p>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
  
  eliminarCita(id: number) {
    this.citaService.eliminarCita(id);
    this.citas = [...this.citaService.getCitas()];
  }

  cambiarEstadoCita(event: { id: number; estado: 'pendiente' | 'completada' | 'cancelada' | 'en espera' }) {
    this.citaService.actualizarEstado(event.id, event.estado);
    this.citas = [...this.citaService.getCitas()];
  }
}
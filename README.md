# VetVibe - Sistema de Gestión de Clínica Veterinaria

VetVibe es una aplicación web responsiva y premium desarrollada en **Angular** y **TypeScript** diseñada para digitalizar la atención médica y administrativa de una clínica veterinaria. El sistema implementa un diseño oscuro moderno con estética **Glassmorphic** (paneles translúcidos con desenfoque y resplandor de fondo) y una paleta de colores verde menta, turquesa (teal) y pizarra (slate).

---

## Estructura de Módulo y División del Trabajo

El proyecto utiliza una **arquitectura modular en Angular** basada en `@NgModule` para segmentar las responsabilidades y permitir el trabajo en paralelo de hasta 3 integrantes:

### Mapeo de Módulos
```text
src/app/
├── core/                  # [INTEGRANTE 1] Servicios globales de datos y guards
│   ├── guards/            # authGuard (protección de rutas privadas)
│   └── services/          # AuthService (simulación de sesión)
├── shared/                # [INTEGRANTE 1] Componentes comunes, directivas y pipes
│   ├── directives/        # HighlightUpcomingDirective (resaltado de citas urgentes)
│   ├── pipes/             # DateFormatPipe y AppointmentStatusPipe
│   └── components/        # Layout principal, Header, Sidebar y DashboardHome (vista de inicio)
├── features/
│   ├── auth/              # [INTEGRANTE 1] Pantalla de Login reactiva
│   ├── mascotas/          # [INTEGRANTE 2] Registro, lista de mascotas e historial clínico
│   └── citas/             # [INTEGRANTE 3 / TÚ] Calendario de agenda y reserva de citas
```

---

## 🛠️ Instalación y Ejecución Local

### Prerrequisitos
*   **Node.js**: Versión 18.x o superior.
*   **NPM**: Versión 9.x o superior.

### Pasos para Ejecutar
1.  **Clonar o descargar** el repositorio en tu máquina local.
2.  Navegar a la carpeta raíz del proyecto:
    ```bash
    cd veterinary-clinic-app
    ```
3.  **Instalar dependencias**:
    ```bash
    npm install
    ```
4.  **Iniciar el servidor de desarrollo**:
    ```bash
    npm start
    ```
5.  Abrir en el navegador [http://localhost:4200/](http://localhost:4200/).

---

## Credenciales de Acceso para Pruebas
Para ingresar al panel de control, utiliza cualquiera de las siguientes credenciales (la contraseña es la misma para todas):

*   **Administrador**: `admin@vetvibe.com` / `password123`
*   **Veterinaria**: `vet.sofia@vetvibe.com` / `password123`

*Nota: El campo de correo electrónico requiere validación reactiva de formato y debe pertenecer obligatoriamente al dominio `@vetvibe.com`.*

---

## 🚀 Guía para los Integrantes del Equipo

### 👤 Para el Integrante 2 (Módulo de Mascotas)
Tu trabajo se concentra en la carpeta `src/app/features/mascotas/`.
Ya tienes generadas las rutas del módulo en `mascotas-routing-module.ts` y el módulo registrado en `mascotas-module.ts`.

1.  **Crear Interfaces**: Puedes definir las interfaces de Mascota en `src/app/core/models/` o directamente en tu módulo.
2.  **Servicios**: Implementa un servicio (`MascotaService`) para guardar, listar y editar mascotas en `LocalStorage` para que tus cambios se guarden.
3.  **Vistas a Desarrollar**:
    *   **Formulario de Registro**: Reemplaza el componente `MascotasPlaceholder` o crea uno nuevo de tipo formulario usando `ReactiveFormsModule` (que ya está importado globalmente).
    *   **Historial Clínico**: Muestra una línea de tiempo (timeline) del paciente. Puedes usar el componente del listado principal para hacer la búsqueda de la mascota.

### 👤 Para el Integrante 3 (Módulo de Citas y Agenda)
Tu trabajo se concentra en la carpeta `src/app/features/citas/`.
Ya tienes configuradas las rutas base del módulo en `citas-routing-module.ts`.

1.  **Diseño de la Agenda**: Reemplaza el componente `CitasPlaceholder` e implementa la vista de calendario semanal/diario.
2.  **Lógica de Reservas**: Diseña el formulario reactivo de agendado (donde se selecciona Mascota y Veterinario).
3.  **Regla de Negocio (Colisiones)**: En tu servicio (`CitaService`), asegúrate de escribir la validación de fecha y hora:
    ```typescript
    // Ejemplo de validación conceptual
    const existeCruce = citasExistentes.some(c => 
      c.veterinario === nuevaCita.veterinario && 
      c.fecha === nuevaCita.fecha
    );
    if (existeCruce) {
      throw new Error("El veterinario seleccionado ya tiene una cita en ese horario.");
    }
    ```

### Reutilización de Utilidades Compartidas (Shared)
Todos los componentes creados en los módulos de Mascotas y Citas pueden utilizar directamente:
*   **DateFormatPipe (`dateFormat`)**: Formatea fechas ISO o tipo Date.
    ```html
    <p>Fecha: {{ cita.fecha | dateFormat }}</p> <!-- Muestra: Sábado, 6 de Jun - 02:00 PM -->
    ```
*   **AppointmentStatusPipe (`appointmentStatus`)**: Traduce estados internos (`pendiente`, `completada`, `cancelada`) a español con formato capitalized.
    ```html
    <span class="badge" [class.badge-success]="cita.estado === 'completada'">
      {{ cita.estado | appointmentStatus }}
    </span>
    ```
*   **HighlightUpcomingDirective (`appHighlightUpcoming`)**: Resalta elementos cuyas fechas estén dentro de las próximas 24 horas.
    ```html
    <div [appHighlightUpcoming]="cita.fecha" class="glass-panel">
      <!-- El panel obtendrá un borde brillante si la cita ocurre pronto -->
    </div>
    ```
*   **Estilos y Layouts**: Las clases utilitarias de estilos en `styles.css` como `.glass-panel`, `.glass-panel-hover`, `.form-control`, `.btn-primary` y `.btn-secondary` están disponibles globalmente en toda la aplicación.

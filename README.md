# VetVibe - Sistema de Gestion de Clinica Veterinaria

VetVibe es una aplicacion web responsiva desarrollada en Angular y TypeScript diseñada para digitalizar la atencion medica y administrativa de una clinica veterinaria. El sistema implementa un diseño oscuro moderno con estetica Glassmorphic (paneles translucidos con desenfoque y resplandor de fondo) y una paleta de colores verde menta, turquesa (teal) y pizarra (slate).

---

## Estructura de Modulo y Division del Trabajo

El proyecto utiliza una arquitectura modular en Angular basada en NgModule para segmentar las responsabilidades y permitir el trabajo en paralelo:

### Mapeo de Modulos
*   src/app/core/
    Módulo Core: Contiene servicios globales de datos y guards.
    - core/guards/auth.ts (Proteccion de rutas mediante guardias de navegacion).
    - core/services/auth.ts (Gestion y simulacion de inicio de sesion de empleados).

*   src/app/shared/
    Módulo Shared: Componentes comunes, directivas y pipes compartidos.
    - shared/components/layout/ (Diseño general con Sidebar y Header responsivos).
    - shared/components/dashboard-home/ (Panel de control principal con estadisticas y listado de citas).
    - shared/directives/highlight-upcoming.ts (Directiva para resaltar citas urgentes).
    - shared/pipes/date-format.ts (Pipe para formato legible de fechas en español).
    - shared/pipes/appointment-status.ts (Pipe para badges de estado de cita traducidos).

*   src/app/features/
    Módulo Features: Contiene los modulos especificos de las funcionalidades de negocio, cargados diferidamente (Lazy Loading).
    - features/auth/ (Modulo de autenticacion y Login reactivo).
    - features/mascotas/ (Modulo de registro, listado, buscador y ficha medica de mascotas).
    - features/citas/ (Modulo de agenda de citas con gestion de estados y control de colisiones).

---

## Instalacion y Ejecucion Local

### Prerrequisitos
*   Node.js: Version 18.x o superior.
*   NPM: Version 9.x o superior.

### Pasos para Ejecutar
1.  Clonar o descargar el repositorio en tu maquina local.
2.  Navegar a la carpeta raiz del proyecto:
    ```bash
    cd veterinaria-git
    ```
3.  Instalar dependencias del proyecto:
    ```bash
    npm install
    ```
4.  Iniciar el servidor de desarrollo local:
    ```bash
    npm start
    ```
5.  Abrir en el navegador la direccion http://localhost:4200.

---

## Credenciales de Acceso para Pruebas
Para ingresar al panel de control, utilice cualquiera de las siguientes credenciales (la contraseña es la misma para todas):

*   Administrador: admin@vetvibe.com / password123
*   Veterinaria: vet.sofia@vetvibe.com / password123

Nota: El campo de correo electronico requiere validacion reactiva de formato y debe pertenecer obligatoriamente al dominio @vetvibe.com.

---

## Funcionalidades e Implementacion Tecnica

### 1. Programacion Orientada a Objetos en TypeScript
El modelado de datos de las mascotas implementa clases de TypeScript para representar de forma logica el comportamiento animal mediante clases abstractas, herencia y polimorfismo:
*   Clase abstracta Mascota que define propiedades comunes y el metodo abstracto requiereCuidadosEspeciales().
*   Clases concretas Perro, Gato, Ave y Exotico que extienden de Mascota e implementan el metodo requiereCuidadosEspeciales() con reglas de negocio personalizadas segun peso, edad o historial clinico.

### 2. Validaciones con ReactiveForms
Utilizacion de ReactiveFormsModule para garantizar la integridad de la entrada de datos:
*   Validaciones de formato de correo electronico en la pantalla de Login.
*   Formulario de Citas que autocompleta el dueño al seleccionar la mascota en un selector desplegable, previniendo errores de asociacion.

### 3. Persistencia de Datos
Uso de LocalStorage a traves de los servicios de Angular (MascotaService y CitaService) para almacenar y persistir los registros clinicos y la agenda de citas de forma local en el navegador del cliente.

### 4. Lógica de Colision de Horarios
El sistema previene la sobre-programacion de los medicos veterinarios en CitaService. Al intentar registrar una cita en una fecha y hora especifica con un veterinario que ya tiene una cita asignada en ese bloque, la aplicacion bloquea la transaccion y muestra una alerta visual de conflicto de agenda.

### 5. Elementos Avanzados de Angular (Pipes y Directivas)
*   DateFormatPipe (date-format.ts): Transforma las fechas en formato ISO a una lectura legible en español (ej. Lunes, 15 de Jun - 10:00 AM).
*   AppointmentStatusPipe (appointment-status.ts): Traduce y da formato a los estados de las citas (pendiente, en espera, completada, cancelada).
*   HighlightUpcomingDirective (highlight-upcoming.ts): Añade dinamicamente la clase de resplandor upcoming-highlight a las tarjetas en el DOM si la cita ocurre dentro de las próximas 24 horas.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CitasComponent } from './pages/citas/citas.component';

// Definición de rutas del módulo
const routes: Routes = [
  { path: '', component: CitasComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CitasComponent // Componente standalone
  ]
})
export class CitasModule {}
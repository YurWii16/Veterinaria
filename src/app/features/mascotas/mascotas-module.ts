import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MascotasRoutingModule } from './mascotas-routing-module';
import { MascotasPlaceholder } from './pages/mascotas-placeholder/mascotas-placeholder';
import { ListaMascotasComponent } from './pages/lista-mascotas/lista-mascotas';

@NgModule({
  declarations: [MascotasPlaceholder],
  imports: [CommonModule, MascotasRoutingModule, ListaMascotasComponent],
  exports: [ListaMascotasComponent],
})
export class MascotasModule {}

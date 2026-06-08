import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitasRoutingModule } from './citas-routing-module';
import { CitasPlaceholder } from './pages/citas-placeholder/citas-placeholder';

@NgModule({
  declarations: [CitasPlaceholder],
  imports: [CommonModule, CitasRoutingModule],
})
export class CitasModule {}

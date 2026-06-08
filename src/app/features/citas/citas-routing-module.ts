import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitasPlaceholder } from './pages/citas-placeholder/citas-placeholder';

const routes: Routes = [
  { path: '', component: CitasPlaceholder }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitasRoutingModule {}

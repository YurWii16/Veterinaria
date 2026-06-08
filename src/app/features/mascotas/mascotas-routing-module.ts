import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaMascotasComponent } from './pages/lista-mascotas/lista-mascotas';
import { CrearMascotaComponent } from './pages/crear-mascota/crear-mascota';
import { DetallesMascotaComponent } from './pages/detalles-mascota/detalles-mascota';
import { MascotasPlaceholder } from './pages/mascotas-placeholder/mascotas-placeholder';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListaMascotasComponent,
      },
      {
        path: 'crear',
        component: CrearMascotaComponent,
      },
      {
        path: ':id',
        component: DetallesMascotaComponent,
      },
      {
        path: 'editar/:id',
        component: CrearMascotaComponent,
      },
    ],
  },
  { path: 'placeholder', component: MascotasPlaceholder },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MascotasRoutingModule {}

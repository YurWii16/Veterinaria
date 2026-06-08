import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayout } from './shared/components/layout/layout';
import { DashboardHome } from './shared/components/dashboard-home/dashboard-home';
import { authGuard } from './core/guards/auth';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardHome
      },
      {
        path: 'mascotas',
        loadChildren: () => import('./features/mascotas/mascotas-module').then(m => m.MascotasModule)
      },
      {
        path: 'citas',
        loadChildren: () => import('./features/citas/citas-module').then(m => m.CitasModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

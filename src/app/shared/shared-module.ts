import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Components
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';
import { DashboardLayout } from './components/layout/layout';
import { DashboardHome } from './components/dashboard-home/dashboard-home';

// Directives
import { HighlightUpcomingDirective } from './directives/highlight-upcoming';

// Pipes
import { DateFormatPipe } from './pipes/date-format';
import { AppointmentStatusPipe } from './pipes/appointment-status';

@NgModule({
  declarations: [
    Header,
    Sidebar,
    DashboardLayout,
    DashboardHome,
    HighlightUpcomingDirective,
    DateFormatPipe,
    AppointmentStatusPipe
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    Header,
    Sidebar,
    DashboardLayout,
    DashboardHome,
    HighlightUpcomingDirective,
    DateFormatPipe,
    AppointmentStatusPipe
  ]
})
export class SharedModule {}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService, User } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  currentUser: User | null = null;
  today = new Date();

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Update time every minute
    setInterval(() => {
      this.today = new Date();
    }, 60000);
  }

  onMenuClick(): void {
    this.toggleSidebar.emit();
  }
}

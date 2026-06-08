import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  username: string;
  name: string;
  role: 'veterinario' | 'recepcionista' | 'administrador';
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor() {
    const savedUser = localStorage.getItem('vetvibe_session');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      savedUser ? JSON.parse(savedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Simulates a login request.
   * Credentials for testing:
   * - Email: admin@vetvibe.com / Password: password123 (Administrador)
   * - Email: vet.sofia@vetvibe.com / Password: password123 (Veterinario)
   */
  login(email: string, password: string): Observable<User> {
    // Basic verification
    if (password !== 'password123') {
      throw new Error('Credenciales inválidas. Intenta con password123');
    }

    let user: User;
    if (email === 'admin@vetvibe.com') {
      user = {
        username: 'admin',
        name: 'Dr. Alejandro Bela',
        role: 'administrador',
        email: 'admin@vetvibe.com'
      };
    } else if (email === 'vet.sofia@vetvibe.com') {
      user = {
        username: 'vet_sofia',
        name: 'Dra. Sofía Martínez',
        role: 'veterinario',
        email: 'vet.sofia@vetvibe.com'
      };
    } else if (email.endsWith('@vetvibe.com')) {
      const name = email.split('@')[0].replace('.', ' ');
      user = {
        username: email.split('@')[0],
        name: name.charAt(0).toUpperCase() + name.slice(1),
        role: 'veterinario',
        email: email
      };
    } else {
      throw new Error('El correo debe pertenecer al dominio @vetvibe.com');
    }

    return of(user).pipe(
      delay(800), // Simulate network latency
      tap(loggedUser => {
        localStorage.setItem('vetvibe_session', JSON.stringify(loggedUser));
        this.currentUserSubject.next(loggedUser);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('vetvibe_session');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }
}

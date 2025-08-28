import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'isAuthenticated';
  private readonly USER_KEY = 'currentUser';

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === '$1xn+V9a?wa]Y0fr54aQns') {
      localStorage.setItem(this.AUTH_KEY, 'true');
      localStorage.setItem(this.USER_KEY, username);
      return true;
    }
    return false;
  }

  logout(): void {
    // Limpiar datos de autenticación
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.clear();
    
    // Prevenir retroceso del navegador
    this.navigationService.preventBackAfterLogout();
    
    // Navegar a login
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  getCurrentUser(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }

  // Método para verificar autenticación en cada navegación
  checkAuthStatus(): boolean {
    const isAuth = this.isAuthenticated();
    if (!isAuth) {
      this.logout();
      return false;
    }
    return true;
  }
}
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {}

  preventBackAfterLogout(): void {
    // Limpiar historial del navegador
    window.history.pushState(null, '', '/login');
    window.history.pushState(null, '', '/login');
    window.history.pushState(null, '', '/login');
    
    // Agregar listener para prevenir retroceso
    window.addEventListener('popstate', this.handlePopState);
    
    // Limpiar listener después de un tiempo
    setTimeout(() => {
      window.removeEventListener('popstate', this.handlePopState);
    }, 10000);
  }

  private handlePopState = (event: PopStateEvent) => {
    // Si alguien intenta volver atrás después de logout
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      window.history.pushState(null, '', '/login');
      this.router.navigate(['/login']);
    }
  };

  clearBackHistory(): void {
    // Limpiar historial del navegador
    window.history.pushState(null, '', window.location.pathname);
    window.history.pushState(null, '', window.location.pathname);
  }
}

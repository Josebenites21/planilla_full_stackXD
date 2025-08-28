import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  usuario: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Prevenir acceso con botón atrás después de logout
    this.preventBackAfterLogout();
  }

  ngOnDestroy() {
    // Limpiar listeners
    window.removeEventListener('popstate', this.handlePopState);
  }

  private preventBackAfterLogout(): void {
    // Limpiar historial del navegador
    window.history.pushState(null, '', '/login');
    window.history.pushState(null, '', '/login');
    
    // Agregar listener para prevenir retroceso
    window.addEventListener('popstate', this.handlePopState);
  }

  private handlePopState = (event: PopStateEvent) => {
    // Si alguien intenta volver atrás después de logout
    if (!this.authService.isAuthenticated()) {
      window.history.pushState(null, '', '/login');
      this.router.navigate(['/login']);
    }
  };

  login() {

    if (this.authService.login(this.usuario, this.password)) {
      // Limpiar el listener de prevenir retroceso
      window.removeEventListener('popstate', this.handlePopState);
      this.router.navigate(['/dashboard']);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }
}
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Agregar headers de autenticación si el usuario está logueado
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (isAuthenticated) {
      request = request.clone({
        setHeaders: {
          'Authorization': 'Bearer ' + localStorage.getItem('currentUser'),
          'Content-Type': 'application/json'
        }
      });
    }
    
    return next.handle(request);
  }
}

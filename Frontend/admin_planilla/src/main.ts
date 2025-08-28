import 'zone.js';   // Importing zone.js for Angular's change detection and async operations
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './app/login/login';
import { DashboardComponent } from './app/dashboard/dashboard';
import { ListadoTrabaadoresComponent } from './app/trabajadores/trabajadores';
import { RegistrarComponent } from './app/trabajadores/registrar-trabajador';
import { HttpClientModule } from '@angular/common/http';
// 👇 importa esto
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'trabajadores', component: ListadoTrabaadoresComponent },
  { path: 'registrar', component: RegistrarComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(FormsModule),
    importProvidersFrom(HttpClientModule),
    
  ],
})
.catch(err => console.error(err));


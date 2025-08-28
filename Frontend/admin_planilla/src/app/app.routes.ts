import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { RegistrarComponent } from './trabajadores/registrar-trabajador';
import { ListadoTrabaadoresComponent } from './trabajadores/trabajadores';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'registrar', 
    component: RegistrarComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'trabajadores', 
    component: ListadoTrabaadoresComponent,
    canActivate: [AuthGuard]
  },
];
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrabajadorService, Empleado } from '../services/trabajador';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar-trabajador.html',
  styleUrls: ['./registrar-trabajador.css'],
  standalone: true,
  imports: [FormsModule]
})
export class RegistrarComponent {
  constructor(
    private router: Router,
    private trabajadorService: TrabajadorService
  ) {}

  // Omitimos "id" porque lo genera Mongo/Backend
  nuevoTrabajador: Omit<Empleado, 'id' | '_id'> = {
  nombre: '',
  apellido: '',
  dni: '',
  cargo: '',
  departamento: '',
  numero: 0,
  direccion: '',
  ingreso_laboral: new Date().toISOString().split('T')[0],
  sueldoBase: 0,
  sueldo: 0
};


  guardarTrabajador() {
    this.trabajadorService.addTrabajador(this.nuevoTrabajador).subscribe({
      next: (response) => {
        console.log('✅ Trabajador agregado:', response);
        alert('✅ Trabajador agregado con éxito');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('❌ Error al agregar trabajador:', error);
        alert('❌ Error al agregar trabajador. Inténtalo de nuevo.');
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrabajadorService, Empleado } from '../services/trabajador';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule]
})
export class DashboardComponent implements OnInit {
  trabajadores: Empleado[] = [];
  trabajadorSeleccionado: Empleado | null = null;
  isLoading = true;
  hasError = false;
  errorMessage = '';

  modalInfoAbierto = false;
  modalEditarAbierto = false;

  expandedIndex: number | null = null;

  constructor(
    private trabajadorService: TrabajadorService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.isLoading = true;
    this.hasError = false;

    this.trabajadorService.getTrabajadores().subscribe({
      next: (data) => {
        console.log("📥 Datos recibidos del backend:", data);
        
        this.trabajadores = (data || []).map((emp) => {
          const empleadoMapeado = {
            ...emp,
            id: emp.id, // 🔹 usamos el id numérico del backend
            // 🔧 IMPORTANTE: SIEMPRE usar el sueldo ACTUALIZADO del backend
            sueldo: Number(emp.sueldo) || 0, // Este es el sueldo que se actualiza en la BD
            // 🔧 IMPORTANTE: El sueldoBase debe ser el sueldo ACTUAL para cálculos futuros
            sueldoBase: Number(emp.sueldo) || 0, // El sueldo actual es la nueva base
            // 🔄 RESETEAR todos los campos de ajuste a 0 al cargar
            aumento: 0,
            adelanto: 0,
            bono: 0,
            horasExtra: 0
          };
          
          console.log(`💰 Empleado ${empleadoMapeado.id} - ${empleadoMapeado.nombre}: Sueldo = ${empleadoMapeado.sueldo}`);
          return empleadoMapeado;
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error al consumir la API:', err);
        this.hasError = true;
        this.errorMessage = 'Error al cargar los empleados. Verifica que el servidor esté funcionando.';
        this.isLoading = false;
      }
    });
  }

  getTotalSueldos(): number {
    return this.trabajadores.reduce((total, emp) => total + (Number(emp.sueldo) || 0), 0);
  }

  getEmpleadosRecientes(): number {
    const tresMesesAtras = new Date();
    tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);

    return this.trabajadores.filter((emp) => {
      if (!emp.ingreso_laboral) return false;
      const fechaIngreso = new Date(emp.ingreso_laboral);
      return fechaIngreso >= tresMesesAtras;
    }).length;
  }

  abrirModalInfo(trab: Empleado) {
    this.trabajadorSeleccionado = { ...trab };
    this.modalInfoAbierto = true;
  }

  cerrarModalInfo() {
    this.modalInfoAbierto = false;
    this.trabajadorSeleccionado = null;
  }

  abrirModalEditar(trab: Empleado) {
    this.trabajadorSeleccionado = { ...trab };
    this.modalEditarAbierto = true;
  }

  cerrarModalEditar() {
    this.modalEditarAbierto = false;
    this.trabajadorSeleccionado = null;
  }

  guardarCambios(trabajador: any) {

    // 🔧 IMPORTANTE: Obtener los valores actuales del array local para asegurar consistencia
    const index = this.trabajadores.findIndex(t => t.id === trabajador.id || t._id === trabajador._id);
    if (index === -1) {
      alert('❌ No se encontró el trabajador en la lista');
      return;
    }
    
    // Usar los valores del array local que son los que realmente se muestran en la UI
    const trabajadorLocal = this.trabajadores[index];
    const aumento = Number(trabajadorLocal.aumento) || 0;
    const adelanto = Number(trabajadorLocal.adelanto) || 0;
    const bono = Number(trabajadorLocal.bono) || 0;
    const horasExtra = Number(trabajadorLocal.horasExtra) || 0;
    
    console.log("🔍 Valores a guardar:", { aumento, adelanto, bono, horasExtra });

    // Usar id si existe, sino usar _id como fallback
    const empleadoId = trabajador.id || trabajador._id;
    console.log("🎯 ID final a usar:", empleadoId);

    this.trabajadorService.updateSueldoConHistorial(empleadoId, {
      aumento: aumento,
      bono: bono,
      horasExtra: horasExtra,
      adelanto: adelanto,
    }).subscribe({
      next: (res: any) => {
        console.log("✅ Respuesta backend:", res);

        if (res.empleado) {
          // Usar sueldoFinal que es el campo real en la base de datos
          trabajador.sueldoFinal = res.empleado.sueldoFinal;
          // Mantener compatibilidad con el campo sueldo para la UI
          trabajador.sueldo = res.empleado.sueldoFinal;
        }
        
        // ✅ Simulación temporal hasta que se actualice el servidor
        if (res) {
          // Calcular el nuevo sueldo localmente usando las variables locales
          const sueldoBase = trabajador.sueldoBase || trabajador.sueldoFinal || 0;
          const pagoPorHoraExtra = 10;
          const nuevoSueldo = sueldoBase + 
            aumento + 
            bono + 
            (horasExtra * pagoPorHoraExtra) - 
            adelanto;
          
          trabajador.sueldoFinal = nuevoSueldo;
          trabajador.sueldo = nuevoSueldo; // Para compatibilidad con la UI
          
          // 🔧 IMPORTANTE: Asegurar que los campos se mantengan en el array local
          // Usar los valores que ya obtuvimos al inicio para mantener consistencia
          if (index !== -1) {
            // ✅ Solo actualizar el sueldo
            this.trabajadores[index].sueldo = nuevoSueldo;
            // �� RESETEAR todos los campos de ajuste a 0
            this.trabajadores[index].aumento = 0;
            this.trabajadores[index].adelanto = 0;
            this.trabajadores[index].bono = 0;
            this.trabajadores[index].horasExtra = 0;
          }
                    alert('✅ Cambios guardados exitosamente');
        }
      },
      error: (err) => {
        console.error('❌ Error al actualizar', err);
        
        // 🔧 Hack temporal para el error 404 - simular actualización local
        if (err.status === 404) {
          console.log("🔧 Aplicando cambios localmente debido a error 404");
          
          const sueldoBase = trabajador.sueldoBase || trabajador.sueldoFinal || 0;
          const pagoPorHoraExtra = 10;
          const nuevoSueldo = sueldoBase + 
            aumento + 
            bono + 
            (horasExtra * pagoPorHoraExtra) - 
            adelanto;
          
          trabajador.sueldoFinal = nuevoSueldo;
          trabajador.sueldo = nuevoSueldo; // Para compatibilidad con la UI
          
          // 🔧 IMPORTANTE: Asegurar que los campos se mantengan en el array local
          // Usar los valores que ya obtuvimos al inicio para mantener consistencia
          if (index !== -1) {
            this.trabajadores[index].aumento = aumento;
            this.trabajadores[index].adelanto = adelanto;
            this.trabajadores[index].bono = bono;
            this.trabajadores[index].horasExtra = horasExtra;
            this.trabajadores[index].sueldoFinal = nuevoSueldo;
            this.trabajadores[index].sueldo = nuevoSueldo;
          }
          
          console.log("💰 Nuevo sueldo calculado localmente:", nuevoSueldo);
          alert('⚠️ Cambios aplicados localmente. El servidor necesita actualización.');
        } else {
          alert('Ocurrió un error al guardar los cambios');
        }
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  btnRegistrar() {
    this.router.navigate(['/registrar']);
  }

  btnConsultar() {
    this.router.navigate(['/trabajadores']);
  }

  recargarDatos() {
    this.cargarEmpleados();
  }

  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { TrabajadorService, Empleado } from '../services/trabajador';
import { PlanillaService } from '../services/planilla.service';
import { formatDateSpanish } from '../utils/date-utils';

@Component({
  selector: 'app-listado-trabajador',
  templateUrl: './trabajadores.html',
  styleUrls: ['./trabajadores.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ListadoTrabaadoresComponent implements OnInit {
  trabajadores: Empleado[] = [];
  empleadoSeleccionado?: Empleado;
  adelantos: number = 0;
  bonos: number = 0;
  horasExtras: number = 0;
  sueldoFinal: number = 0;

  // Nuevas propiedades para consulta por mes
  mesSeleccionado: string = '';
  pagosDelMes: any[] = [];
  mesesDisponibles: string[] = [];

  constructor(
    private trabajadorService: TrabajadorService, 
    private planillaService: PlanillaService
  ) {}

  ngOnInit() {
    this.cargarTrabajadores();
    this.cargarMesesDisponibles();
  }

  cargarTrabajadores() {
    this.trabajadorService.getTrabajadores().subscribe({
      next: (data) => this.trabajadores = data,
      error: (err) => console.error('Error al cargar trabajadores', err)
    });
  }

  // Nuevo método para cargar meses disponibles
  cargarMesesDisponibles() {
    // Por ahora, generamos los últimos 12 meses
    const meses = [];
    const fecha = new Date();
    for (let i = 0; i < 12; i++) {
      const mes = new Date(fecha.getFullYear(), fecha.getMonth() - i, 1);
      const mesString = mes.toISOString().slice(0, 7); // YYYY-MM
      meses.push(mesString);
    }
    this.mesesDisponibles = meses;
    console.log('📅 Meses disponibles:', this.mesesDisponibles);
  }

  // Nuevo método para cargar pagos por mes
  cargarPagosPorMes() {
    if (!this.mesSeleccionado) {
      this.pagosDelMes = [];
      return;
    }

    // Usar el método correcto del servicio
    this.planillaService.listarPorMes(this.mesSeleccionado).subscribe({
      next: (data) => {
        // Verificar que data sea un array válido
        if (Array.isArray(data)) {
          this.pagosDelMes = data;
          console.log(`📊 Pagos del mes ${this.mesSeleccionado}:`, data);
        } else {
          console.warn(`⚠️ Respuesta inesperada del servidor para ${this.mesSeleccionado}:`, data);
          this.pagosDelMes = [];
        }
      },
      error: (err) => {
        console.error(`❌ Error al cargar pagos del mes ${this.mesSeleccionado}:`, err);
        this.pagosDelMes = [];
        
        // Mostrar mensaje más específico según el tipo de error
        if (err.status === 0) {
          console.error('Error de conexión: No se pudo conectar al servidor');
        } else if (err.status === 404) {
          console.error('Recurso no encontrado');
        } else if (err.status === 500) {
          console.error('Error interno del servidor');
        }
      }
    });
  }

  // Método para formatear fechas en español
  formatearFecha(mes: string): string {
    return formatDateSpanish(mes, 'MMMM yyyy');
  }

  seleccionarEmpleado(emp: Empleado) {
    this.empleadoSeleccionado = emp;
    this.calcularSueldoFinal();
  }

  calcularSueldoFinal() {
    if (!this.empleadoSeleccionado) return;
    let sueldo = this.empleadoSeleccionado.sueldo || 0;
    sueldo += this.bonos + this.horasExtras;
    sueldo -= this.adelantos;
    this.sueldoFinal = sueldo;
  }

  guardarPlanilla() {
    const planilla = {
      empleadoId: this.empleadoSeleccionado?._id || '',
      nombre: this.empleadoSeleccionado?.nombre || '',
      cargo: this.empleadoSeleccionado?.cargo || '',
      departamento: this.empleadoSeleccionado?.departamento || '',
      sueldoBase: this.empleadoSeleccionado?.sueldo || 0,
      adelantos: this.adelantos || 0,
      bonos: this.bonos || 0,
      horasExtras: this.horasExtras || 0,
      sueldoFinal: this.sueldoFinal,
      mes: '' // si quieres agregarlo
    };

    this.planillaService.guardarPlanilla(planilla).subscribe({
      next: (res) => {
        console.log("✅ Planilla guardada:", res);
        alert("Planilla guardada correctamente");
      },
      error: (err) => {
        console.error("❌ Error al guardar planilla:", err);
        alert("Error al guardar planilla");
      }
    });
  }
}

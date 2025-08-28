import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// services/trabajador.ts
export interface Empleado {
  id?: string | number;  // 👈 acepta ambas
  _id?: string;
  nombre: string;
  apellido: string;
  dni: string;
  cargo?: string;
  departamento?: string;
  numero?: number;
  direccion?: string;
  telefono?: string;  // 👈 AGREGADA la propiedad telefono
  ingreso_laboral: string;
  sueldoBase: number;
  sueldo?: number;
  aumento?: number;
  adelanto?: number;
  bono?: number;
  horasExtra?: number;
  sueldoFinal?: number;
}


@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  private apiUrl = 'http://15.235.16.229:3000'; // ⚡ backend expuesto

  constructor(private http: HttpClient) {}

  getTrabajadores(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}/empleados`);
  }
  

  getTrabajador(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${id}`);
  }

  addTrabajador(trabajador: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, trabajador);
  }

  updateTrabajador(id: number | string, trabajador: any): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/empleados/${id}`,
    trabajador,
    { headers: { 'Content-Type': 'application/json' } }
  );
}

  updateSueldo(id: number, nuevoSueldo: number): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/empleados/${id}`,   // 👈 usa la ruta ya definida
    { sueldo: nuevoSueldo }, 
    { headers: { 'Content-Type': 'application/json' } }
  );
}
registrarPago(id: string, payload: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/empleados/${id}/pago`, payload, {
    headers: { 'Content-Type': 'application/json' }
  });
}

updateSueldoConHistorial(id: number | string, cambios: any) {
  console.log("🚀 Enviando PUT a:", `${this.apiUrl}/empleados/${id}`);
  console.log("📦 Datos enviados:", cambios);
  
  return this.http.put(
    `${this.apiUrl}/empleados/${id}`,
    cambios,
    { headers: { 'Content-Type': 'application/json' } }
  );
}


}







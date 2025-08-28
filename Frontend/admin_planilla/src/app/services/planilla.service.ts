import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface RegistroPlanilla {
  empleadoId: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldoBase: number;
  adelantos?: number;
  bonos?: number;
  horasExtras?: number;
  sueldoFinal: number;
  mes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlanillaService {
  private apiUrl = 'http://15.235.16.229:3000'; // backend expuesto

  constructor(private http: HttpClient) {}

  guardarPlanilla(planilla: RegistroPlanilla): Observable<RegistroPlanilla> {
    return this.http.post<RegistroPlanilla>(this.apiUrl, planilla)
      .pipe(
        catchError(this.handleError)
      );
  }

  listarPorMes(mes: string): Observable<RegistroPlanilla[]> {
    console.log(`🔍 Consultando pagos para el mes: ${mes}`);
    
    return this.http.get(`${this.apiUrl}?mes=${mes}`, { 
      responseType: 'text'
    })
      .pipe(
        map((response: any) => {
          console.log(`📡 Respuesta del servidor para ${mes}:`, response);
          
          // Verificar si la respuesta es HTML en lugar de JSON
          if (typeof response === 'string' && response.includes('API Planilla OK')) {
            console.error(`❌ El servidor está devolviendo HTML en lugar de JSON para ${mes}`);
            console.error(`🔧 Respuesta del servidor: "${response}"`);
            console.error(`💡 El backend no está implementando correctamente el endpoint GET /?mes=${mes}`);
            return [];
          }
          
          // Intentar parsear como JSON si es string
          let data;
          if (typeof response === 'string') {
            try {
              data = JSON.parse(response);
            } catch (e) {
              console.error(`❌ Error al parsear JSON del servidor para ${mes}:`, e);
              console.error(`📄 Respuesta recibida:`, response);
              return [];
            }
          } else {
            data = response;
          }
          
          // Verificar si la respuesta es válida
          if (data && Array.isArray(data)) {
            console.log(`✅ Array directo encontrado con ${data.length} elementos`);
            return data;
          } else if (data && data.data && Array.isArray(data.data)) {
            console.log(`✅ Array en data encontrado con ${data.data.length} elementos`);
            return data.data;
          } else if (data && data.pagos && Array.isArray(data.pagos)) {
            console.log(`✅ Array en pagos encontrado con ${data.pagos.length} elementos`);
            return data.pagos;
          } else if (data && data.length === 0) {
            console.log(`ℹ️ Respuesta vacía del servidor para ${mes}`);
            return [];
          } else {
            console.warn(`⚠️ Respuesta del servidor no tiene el formato esperado para ${mes}:`, data);
            return [];
          }
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.status === 200 && error.message.includes('parsing')) {
        errorMessage = `Error de parsing: El servidor devolvió status 200 pero la respuesta no es JSON válido. 
        URL: ${error.url}
        Respuesta: ${JSON.stringify(error.error)}`;
      } else if (error.status === 0) {
        errorMessage = 'Error de conexión: No se pudo conectar al servidor';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado (404)';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor (500)';
      } else {
        errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
      }
    }
    
    console.error('❌ Error en PlanillaService:', errorMessage);
    console.error('🔍 Detalles del error:', error);
    return throwError(() => new Error(errorMessage));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private baseUrl = 'http://15.235.16.229:3000'; // backend expuesto en host

  constructor(private http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get(`${this.baseUrl}/empleados`);
  }

  obtener(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/empleados/${id}`);
  }
}

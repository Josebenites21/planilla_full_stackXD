import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private trabajadores: any[] = [];

  agregarTrabajador(trabajador: any) {
    this.trabajadores.push(trabajador);
  }

  getTrabajadores() {
    return this.trabajadores;
  }
}

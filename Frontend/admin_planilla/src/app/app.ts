import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';  // 👈 importa RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,          // 👈 necesario para standalone
  imports: [RouterOutlet],   // 👈 aquí lo declaras
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
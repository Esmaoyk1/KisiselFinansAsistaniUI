import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [RouterModule], 
  template: `
    <div class="login-layout">
      <router-outlet></router-outlet>
    </div>
  `,

})
export class LoginLayoutComponent { }

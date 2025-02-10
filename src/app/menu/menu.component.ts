import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../Auth/auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  constructor(
    public authService: AuthService
  ) { }
}

import { Component } from '@angular/core';
import { UserapiService } from '../../../services/user-api.service';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.css'
})
export class HomeLayoutComponent {
  totalUsers: number = 0; // Toplam kullanıcı sayısı için değişken

  constructor(private userService: UserapiService) { }

  ngOnInit(): void {
    this.getUsers(); // Kullanıcıları al
  }


  getUsers(): void {
    this.userService.getUsers().subscribe(
      response => {
        // Eğer yanıt doğrudan bir dizi ise
        if (Array.isArray(response)) {
          this.totalUsers = response.length;
          console.log("Toplam Kullanıcı Sayısı:", this.totalUsers);
        } else {
          console.error('Beklenmeyen yanıt yapısı:', response);
        }
      },
      error => {
        console.error('Hata:', error);
      }
    );
  }
}

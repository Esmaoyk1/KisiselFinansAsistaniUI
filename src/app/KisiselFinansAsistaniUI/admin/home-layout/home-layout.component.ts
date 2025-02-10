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
  totalUsers: number = 0; // Toplam kullanıcı sayısı
  totalAdmins: number = 0; // Toplam admin sayısı
  totalRating: number = 0; // Toplam puan sayısı


  constructor(private userService: UserapiService) { }

  ngOnInit(): void {
    this.getUsers(); // Kullanıcıları al
    this.getRating(); // Toplam puanı al
  }


  getUsers(): void {
    this.userService.getUsers().subscribe(
      response => {
        // Eğer yanıt beklenen yapıda ise
        if (response && response.adminUsers && response.regularUsers) {
          this.totalUsers = response.adminUsers.length + response.regularUsers.length;
          this.totalAdmins = response.adminUsers.length;

          console.log("Toplam Kullanıcı Sayısı:", this.totalUsers);
          console.log("Toplam Admin Sayısı:", this.totalAdmins);
        } else {
          console.error('Beklenmeyen yanıt yapısı:', response);
        }
      },
      error => {
        console.error('Hata:', error);
      }
    );
  }

  getRating(): void {
    this.userService.getRating().subscribe(
      response => {
        if (response && response.success) {
          this.totalRating = response.data.rating;
          console.log("Toplam Puan Sayısı:", this.totalRating);
        } else {
          console.error('Puan alınamadı:', response);
        }
      },
      error => {
        console.error('Hata:', error);
      }
    );
  }
}

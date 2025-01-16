import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountApiService } from '../../services/account-api.service';

@Component({
  selector: 'app-account-delete',
  standalone: true,
  imports: [],
  templateUrl: './account-delete.component.html',
  styleUrl: './account-delete.component.css'
})
export class AccountDeleteComponent {

  hedefId: number | null = null;
  post: any;


  constructor(private route: ActivatedRoute, private router: Router, private accountApiService: AccountApiService) {
    const id = this.route.snapshot.paramMap.get('sid'); // ID'yi al
    this.hedefId = id ? +id : null; // String değerini number'a dönüştür

    if (this.hedefId) {
      this.accountApiService.getPostById(this.hedefId).subscribe(response => {
        this.post = response;
      }, error => {
        console.error('Veri alınırken hata:', error);
      });
    }
  }

  ngOnInit() {

  }

  confirmDelete() {


    if (this.hedefId) {
      this.accountApiService.deletePost(this.hedefId).subscribe(
        response => {
          console.log('Başarıyla silindi:', response);
          this.router.navigate(['/account']);
        },
        error => {
          console.error('Silme hatası:', error);
          alert(error.error.message || 'Silme sırasında bir hata oluştu.');
        }
      );

    }
  }
  cancel() {
    this.router.navigate(['/account']); 
  }


}

import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BanksApiService } from '../../../../services/banks-api.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-setting-bank-update',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './setting-bank-update.component.html',
  styleUrls: ['./setting-bank-update.component.css']
})
export class SettingBankUpdateComponent {
  bankId: number | null = null;
  bankName: string = '';

  constructor(
    private route: ActivatedRoute,
    private bankApiService: BanksApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bankId = +this.route.snapshot.paramMap.get('id')!; // Bank ID'yi al
    this.loadBankDetails();
  }


  //editBank(id: number, bankName: string): void {
  //  this.editingBankId = id;
  //  this.newBank = bankName; // Banka adını input alanına getir
  //}


  //loadBankDetails(): void {
  //  if (this.bankId) {
  //    this.bankApiService.getBankId(this.bankId).subscribe(
  //      (response) => {
  //        this.bankName = response.banksName; // Banka adını formda göster
  //      },
  //      (error) => {
  //        console.error('Error fetching bank details:', error);
  //      }
  //    );
  //  }
  //}
  //updateBank(): void {
  //  if (this.bankId && this.bankName) {
  //    // API'nin beklediği formata uygun nesne oluşturma
  //    const updatedBank = { id: this.bankId, banksName: this.bankName };

  //    console.log('Güncellenen banka verisi:', updatedBank); // Veriyi konsola yazdır

  //    this.bankApiService.updatePost(this.bankId, updatedBank).subscribe(
  //      (response) => {
  //        console.log('API yanıtı:', response); // API yanıtını konsola yazdır
  //        alert('Banka başarıyla güncellendi!');
  //        this.router.navigate(['/settingBank']); // Güncelleme sonrası geri yönlendir
  //      },
  //      (error) => {
  //        console.error('Error updating bank:', error);
  //        alert('Güncelleme sırasında bir hata oluştu: ' + (error.error?.message || 'Bilinmeyen hata.'));
  //      }
  //    );
  //  } else {
  //    alert('Banka adı boş olamaz!'); // Boş kontrolü
  //  }
  //}

  loadBankDetails(): void {
    if (this.bankId) {
      this.bankApiService.getBankId(this.bankId).subscribe(
        (response) => {
          this.bankName = response.banksName; // Banka adını formda göster
        },
        (error) => {
          console.error('Error fetching bank details:', error);
        }
      );
    }
  }

  updateBank(): void {
    if (this.bankId && this.bankName) {
      const updatedBank = { id: this.bankId, banksName: this.bankName }; // Güncellenen veri

      this.bankApiService.updatePost(this.bankId, updatedBank).subscribe(
        () => {
          alert('Banka başarıyla güncellendi!');
          this.router.navigate(['/settingBank']); // Güncelleme sonrası geri yönlendir
        },
        (error) => {
          console.error('Error updating bank:', error);
          alert('Güncelleme sırasında bir hata oluştu: ' + (error.error?.message || 'Bilinmeyen hata.'));
        }
      );
    } else {
      alert('Banka adı boş olamaz!'); // Boş kontrolü
    }
  }
}

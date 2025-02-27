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
  bank: any;

  constructor(
    private route: ActivatedRoute,
    private bankApiService: BanksApiService,
    private router: Router
  ) {


    this.bankId = +this.route.snapshot.paramMap.get('id')!; // Bank ID'yi al

    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {

      this.bank = navigation.extras.state['post'];
      this.bankName = this.bank.bankName;
      console.log("banka geldi");
      console.log(this.bank);

    } else {
      this.bank = {};
    }
    this.loadBankDetails();
}

  ngOnInit(): void {
  }


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
    if (this.bankId && this.bank.bankName) {
      const updatedBank = { id: this.bank.id, banksName: this.bank.bankName }; // Güncellenen veri

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

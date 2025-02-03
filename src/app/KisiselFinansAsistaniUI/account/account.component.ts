import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuComponent } from '../../menu/menu.component';
import { AccountApiService } from '../../services/account-api.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BanksApiService } from '../../services/banks-api.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterModule, MenuComponent, FormsModule, CommonModule],
  providers: [AccountApiService,BanksApiService],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  userbalance: any;
  account = {
    bankID:0,
    accountName: '',
    accountType: '',
    balance: 0,
    createdDate: '',
    currency: 'TL',
    status: true 
  };

 
  bankaBilgileri: { accountID: number, bankId: number, bankName: string, accountName: string, accountTypeName: string, accountType: number, balance: number }[] = [];
  bankNames: { id: number, bankName: string }[] = [];
  accountName: string = '';
  accountType: string = '';
  balance: number = 0;
  accountID: number = 0;

  selectedItem: any = 0;

  isUpdateFormVisible: boolean = false;
  constructor(private accountapiService: AccountApiService,
    private bankApiService: BanksApiService,
    private router: Router) {

  /*  this.accountName = this.bankName;*/
  };


  ngOnInit() {
    this.GetUserBalance();
    this.accountGet();
    this.loadBankNames();
  }
  GetUserBalance() {
    this.accountapiService.getUserAccountBalance().subscribe(
      response => {
        console.log('başarılı:', response);
        this.userbalance = parseFloat(response.data.balance).toFixed(2);  

      },
      error => {

        //console.error(' hata:', error);
        //alert(' hatası:' + error.error.message);
      }
    );
  }

  onSubmit() {
    this.accountapiService.createPost(this.account).subscribe(
      response => {
        alert( response.message);
       
        this.router.navigate(['/account']).then(() => {
          window.location.reload();
        });

      },
      error => {
        console.error('Hata:', error);
        alert('Hata oluştu: ' + error.message);
      }
    );
  } 

  accountGet() {
    this.accountapiService.getPosts().subscribe(
      response => {
      

        // response.data'nın dizide olup olmadığını kontrol et
        if (Array.isArray(response.data)) {
          this.bankaBilgileri = response.data.items; // Hesapları dizi olarak al
          console.log(' this.accounts:', this.bankaBilgileri);
        } else {
          // Eğer nesne ise, diziyi oluştur
          this.bankaBilgileri = Object.values(response.data.items);
          console.log('else this.accounts:', this.bankaBilgileri);
        }

        //console.log('Alınan hesaplar:', this.accounts);
      },
      error => {
        console.error('Hesap verileri alınırken hata oluştu:', error);
        alert('Hata oluştu: ' + error.message);
      }
    );
  }

  private loadBankNames(): void {
    this.bankApiService.getPosts().subscribe({
      next: (response) => {
        this.bankNames = response.data.items; // API'den gelen banka adlarını al
        //console.log(this.bankNames[0].bankName+"Bank names loaded: ", this.bankNames);
      
      },
      error: (err) => {
        console.error("Bank loading failed: ", err);
      }
    });
  }

  guncelle(item: any) {
    this.selectedItem = { ...item }; // Seçilen öğeyi kopyala
    this.isUpdateFormVisible = true; // Güncelleme formunu göster
  }

  accountUpdate(sid: number, post: any) {
    this.router.navigate(['accountUpdate', sid], { state: { veri: post } });
  }

  //onUpdate(form: NgForm) {
  //  if (form.valid && this.selectedItem) {
  //    this.accountapiService.updatePost(this.selectedItem.accountID, this.selectedItem).subscribe(response => {
  //      console.log('Başarıyla güncellendi:', response);
  //      const index = this.accounts.findIndex(item => item.accountID === this.selectedItem.accountID);
  //      if (index !== -1) {
  //        this.accounts[index] = this.selectedItem; // Dizi içindeki öğeyi güncelle
  //      }
  //      this.isUpdateFormVisible = false; // Güncelleme formunu gizle
  //    }, error => {
  //      console.error('Güncelleme hatası:', error);
  //    });
  //  } else {
  //    console.log('Form geçersiz.');
  //  }
  //}

  onUpdate(form: NgForm) {
    if (form.valid && this.selectedItem) {
      this.accountapiService.updatePost(this.selectedItem.accountID, this.selectedItem).subscribe(response => {
        console.log('Başarıyla güncellendi:', response);
        const index = this.bankaBilgileri.findIndex(item => item.accountID === this.selectedItem.accountID);
        if (index !== -1) {
          this.bankaBilgileri[index] = this.selectedItem; // Dizi içindeki öğeyi güncelle
        }
        this.isUpdateFormVisible = false; // Güncelleme formunu gizle
      }, error => {
        console.error('Güncelleme hatası:', error);
      });
    } else {
      console.log('Form geçersiz.');
    }
  }
  
}




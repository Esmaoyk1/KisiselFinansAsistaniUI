import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../menu/menu.component';
import { AccountApiService } from '../../services/account-api.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterModule, MenuComponent],
  providers: [AccountApiService],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  userbalance: any;
  constructor(private accountapiService: AccountApiService) { };


  ngOnInit() {
   this.GetUserBalance();
  }
  GetUserBalance() {
    this.accountapiService.getUserAccountBalance(1).subscribe(
      response => {
        console.log('başarılı:', response);
        this.userbalance = parseFloat(response.data.balance).toFixed(2);  

      },
      error => {
        console.error(' hata:', error);
        alert(' hatası:');
      }
    );
  }
}




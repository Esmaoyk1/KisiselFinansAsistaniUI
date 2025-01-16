//import { Component } from '@angular/core';

//@Component({
//  selector: 'app-account-update',
//  standalone: true,
//  imports: [],
//  templateUrl: './account-update.component.html',
//  styleUrl: './account-update.component.css'
//})
//export class AccountUpdateComponent {

//}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountApiService } from '../../services/account-api.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BanksApiService } from '../../services/banks-api.service';
import { response } from 'express';

@Component({
  selector: 'app-account-update',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  providers: [BanksApiService, AccountApiService],
  templateUrl: './account-update.component.html',
  styleUrls: ['./account-update.component.css']
})
export class AccountUpdateComponent implements OnInit {
  selectedItem: any;
  post: any;
  bankNames: { id: number, bankName: string }[] = [];
  accountType: {id : number ,  accountType: string }[] = [];

  constructor(
    private accountApiService: AccountApiService,
    private bankApiService: BanksApiService,
    public router: Router,
    private route: ActivatedRoute
  ) {

    this.loadBankNames();
    this.loadAccountType();
    const id = this.route.snapshot.paramMap.get('sid');

    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
     
      this.post = navigation.extras.state['post'];
      console.log("post geldim : ");
      console.log(this.post);

    } else {
      console.warn('Navigation veya state bulunamadı.');
      this.post = {};
    }


    //const navigation = this.router.getCurrentNavigation();
    //if (navigation?.extras.state) {
    //  this.post = navigation.extras.state['post'];
    //  console.log(this.post);
    //} else {
    //  console.log('No state found');
    //}
    //console.log("navigatin : ");
    //console.log(navigation);
    //if (navigation && navigation.extras.state) {
    //  this.selectedItem = navigation.extras.state['post'];
    //  alert("nav agbkag");
    //  console.log("seletedıtem geldi : ");
    //  console.log(this.selectedItem);
    //}
  }

  ngOnInit(): void {
    // Route'dan gönderilen durumu al

  }

  private loadBankNames(): void {
    this.bankApiService.getPosts().subscribe({
      next: (response) => {
        this.bankNames = response.data.items; // API'den gelen banka adlarını al
        console.log(this.bankNames);
      },
      error: (err) => {
        console.error("Bank loading failed: ", err);
      }
    });
  }

  private loadAccountType(): void {
    this.bankApiService.getAccountType().subscribe({
      next: (response) => {
        this.accountType = response.data.items;
        console.log("this.accountType");
        console.log(this.accountType);
      },
      error: (err) => {
        console.error("Banka Türü Hatası alındı..: ", err);
      }
    })
  }

  onUpdate(form: NgForm) {
    if (form.valid && this.selectedItem) {
      this.accountApiService.updatePost(this.post.accountID, this.selectedItem).subscribe(response => {
        console.log('Başarıyla güncellendi:', response);
        this.router.navigate(['/account']); // Güncelleme sonrası ana hesaba yönlendir
      }, error => {
        console.error('Güncelleme hatası:', error);
      });
    } else {
      console.log('Form geçersiz.');
    }
  }
}

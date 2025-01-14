import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs'; // Observable kullanacağız
//import { MenuComponent } from './menu/menu.component';
//import { SearchBarComponent } from './search-bar/search-bar.component';
import { AccountComponent } from './KisiselFinansAsistaniUI/account/account.component';

//import {  HttpClient } from '@angular/common/http';
//import { KisiselApiService } from './services/kisisel-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, AccountComponent /*SearchBarComponent,*/ ],
  providers: [
  ]
})
export class AppComponent {
 

}

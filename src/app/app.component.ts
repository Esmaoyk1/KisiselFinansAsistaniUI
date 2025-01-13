import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs'; // Observable kullanacağız
//import { MenuComponent } from './menu/menu.component';
//import { SearchBarComponent } from './search-bar/search-bar.component';
import { AccountComponent } from './KisiselFinansAsistaniUI/account/account.component';

import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './Auth/token.interceptor';
import { AuthService } from './Auth/auth-service.service';
import { KisiselApiService } from './services/kisisel-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, AccountComponent,HttpClientModule /*SearchBarComponent,*/ ],
  providers: [
   
    KisiselApiService, HttpClientModule
  ]
})
export class AppComponent {
 
  //private authService = inject(AuthService); // AuthService'yi injection ile alıyoruz*/
  private httpClient = inject(HttpClient); // HttpClient'ı da injection ile alıyoruz

}

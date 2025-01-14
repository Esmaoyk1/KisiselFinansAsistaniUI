import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
//import { HttpClient } from '@angular/common/http';
//import { AuthService } from '../Auth/auth-service.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  imports: [RouterOutlet, MenuComponent, SearchBarComponent],
})
export class MainLayoutComponent {

  //private authService = inject(AuthService); // AuthService'yi injection ile alıyoruz*/
  //private httpClient = inject(HttpClient); // HttpClient'ı da injection ile alıyoruz

}

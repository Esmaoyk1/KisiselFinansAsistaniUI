import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs'; // Observable kullanacağız
import { MenuComponent } from './menu/menu.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { AccountComponent } from './KisiselFinansAsistaniUI/account/account.component';

import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, MenuComponent, AccountComponent, SearchBarComponent, HttpClientModule],
})
export class AppComponent {
  title = 'my-app'; // Uygulamanızın adı veya başlığı
}

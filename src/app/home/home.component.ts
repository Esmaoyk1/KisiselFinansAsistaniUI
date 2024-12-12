import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs'; // Observable kullanacağız

import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'
import { MenuComponent } from '../menu/menu.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { KisiselApiService } from '../services/kisisel-api.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, SearchBarComponent, HttpClientModule],
  providers: [ KisiselApiService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'KisiselFinansAsistaniUI';
  posts: any[] = [];
  jtoken: any;
  constructor(private kisiselapiService: KisiselApiService, private http: HttpClient) { }

  ngOnInit() {
    this.kisiselLogin();
  }
  kisiselLogin() {
    const post = {
      email: "ada@gmail.com",
      password: "Esma.38"
    };

    this.kisiselapiService.createPost(post).subscribe(
      response => {
        console.log(response);

        // JSON'u parse et
        // const parsedData = JSON.parse(response);

        // Değerleri kullanma
        const token = response.token;
        this.jtoken = token;
        //const expiration = new Date(response.expiration);

        console.log('.gleentoken:', token);
        //console.log('Expiration Date:', expiration);

      },
      error => {
        console.error('Post oluşturma hatası:', error);
      }
    );
  }
}

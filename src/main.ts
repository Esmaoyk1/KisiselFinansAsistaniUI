import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';  // HttpClientModule import edilmiştir
import { importProvidersFrom } from '@angular/core';     // importProvidersFrom import edilmiştir
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    //HttpClientModule modul globaldedir başka componenten çağrılmammalı zazten global DI dan geelcek
    importProvidersFrom(HttpClientModule),  // HttpClientModule burada sağlanıyor
    ...appConfig.providers  // appConfig'in provider'larını buraya ekleyin
  ]
}).catch((err: any) => console.error(err));

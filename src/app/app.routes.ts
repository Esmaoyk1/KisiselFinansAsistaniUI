import { Route, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';  // Örnek bileşen
import { LoginComponent } from './Auth/user/login/login.component';
import { HomeComponent } from './home/home.component';
import { Comp1Component } from './comp1/comp1.component';
import { SignUpComponent } from './Auth/user/sign-up/sign-up.component';
import { AccountComponent } from './KisiselFinansAsistaniUI/account/account.component';
import { BudgetComponent } from './KisiselFinansAsistaniUI/budget/budget.component';
import { SavingComponent } from './KisiselFinansAsistaniUI/saving/saving.component';
import { SavingUpdateComponent } from './KisiselFinansAsistaniUI/saving-update/saving-update.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent }, // Ana sayfa
  { path: 'account', component: AccountComponent },
  { path: 'budget', component: BudgetComponent },
  { path: 'saving', component: SavingComponent },
  { path: 'savingUpdate/:id', component: SavingUpdateComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },    // Geçersiz yollar için ana sayfaya yönlendirme

];

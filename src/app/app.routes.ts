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
import { SavingDeleteComponent } from './KisiselFinansAsistaniUI/saving-delete/saving-delete.component';
import { BudgetDeleteComponent } from './KisiselFinansAsistaniUI/budget-delete/budget-delete.component';
import { BudgetUpdateComponent } from './KisiselFinansAsistaniUI/budget-update/budget-update.component';
import { AccountUpdateComponent } from './KisiselFinansAsistaniUI/account-update/account-update.component';
import { LoginLayoutComponent } from './Auth/user/login.layout.component';
import { MainLayoutComponent } from './KisiselFinansAsistaniUI/main-layout.component';

export const routes: Route[] = [

  {
    path: '', // Ana layout
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent }, // Ana sayfa
      { path: 'account', component: AccountComponent },
      { path: 'budget', component: BudgetComponent },
      { path: 'saving', component: SavingComponent },
      { path: 'savingUpdate/:sid', component: SavingUpdateComponent },
      { path: 'savingDelete/:sid', component: SavingDeleteComponent },
      { path: 'budgetDelete/:sid', component: BudgetDeleteComponent },
      { path: 'budgetUpdate/:sid', component: BudgetUpdateComponent },
      { path: 'accountUpdate/:sid', component: AccountUpdateComponent },
    ],
  },

  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
    ],
  },
 
 
  { path: 'signUp', component: SignUpComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },    // Geçersiz yollar için ana sayfaya yönlendirme

];
/*
const routes: Routes = [
  {
    path: 'login',
    component: LoginLayoutComponent, // Login için özel layout
    children: [
      { path: '', component: LoginComponent },
    ],
  },
  {
    path: '',
    component: AdminLayoutComponent, // Admin için özel layout
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];



*/

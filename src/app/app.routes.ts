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
import { AuthGuard } from './Auth/guards/auth.guard';
import { AccountDeleteComponent } from './KisiselFinansAsistaniUI/account-delete/account-delete.component';
import { TransactionUpdateComponent } from './KisiselFinansAsistaniUI/transaction-update/transaction-update.component';
import { TransactionDeleteComponent } from './KisiselFinansAsistaniUI/transaction-delete/transaction-delete.component';
import { TransactionComponent } from './KisiselFinansAsistaniUI/transaction/transaction.component';

export const routes: Route[] = [

  {
    path: '', // Ana layout
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent, canActivate: [AuthGuard] }, // Ana sayfa
      { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
      { path: 'budget', component: BudgetComponent, canActivate: [AuthGuard] },
      { path: 'saving', component: SavingComponent, canActivate: [AuthGuard] },
      { path: 'transaction', component: TransactionComponent, canActivate: [AuthGuard] },
      { path: 'savingUpdate/:sid', component: SavingUpdateComponent, canActivate: [AuthGuard] },
      { path: 'savingDelete/:sid', component: SavingDeleteComponent, canActivate: [AuthGuard] },
      { path: 'budgetDelete/:sid', component: BudgetDeleteComponent, canActivate: [AuthGuard] },
      { path: 'budgetUpdate/:sid', component: BudgetUpdateComponent, canActivate: [AuthGuard] },
      { path: 'accountUpdate/:sid', component: AccountUpdateComponent, canActivate: [AuthGuard] },
      { path: 'accountDelete/:sid', component: AccountDeleteComponent, canActivate: [AuthGuard] },
      { path: 'transactionDelete/:sid', component: TransactionDeleteComponent, canActivate: [AuthGuard] },
      { path: 'transactionUpdate/:sid', component: TransactionUpdateComponent, canActivate: [AuthGuard] }
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

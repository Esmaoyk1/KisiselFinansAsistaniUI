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
import { UserProfileComponent } from './KisiselFinansAsistaniUI/user-profile/user-profile.component';
import { HomeLayoutComponent } from './KisiselFinansAsistaniUI/admin/home-layout/home-layout.component';
import { UserComponent } from './KisiselFinansAsistaniUI/admin/user-menu/user.component';
import { AdminMenuComponent } from './KisiselFinansAsistaniUI/admin/admin-menu/admin-menu.component';
import { UserUpdateComponent } from './KisiselFinansAsistaniUI/admin/user-update/user-update.component';
import { UserDeleteComponent } from './KisiselFinansAsistaniUI/admin/user-delete/user-delete.component';
import { ResetPasswordComponent } from './Auth/user/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './Auth/user/forgot-password/forgot-password.component';

export const routes: Route[] = [

  {
    path: '', // Ana layout
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent, canActivate: [AuthGuard], data: { role: 'User' } }, // Ana sayfa
      { path: 'account', component: AccountComponent, canActivate: [AuthGuard], data: { role: 'User' } },
      { path: 'accountUpdate/:sid', component: AccountUpdateComponent, canActivate: [AuthGuard] },
      { path: 'accountDelete/:sid', component: AccountDeleteComponent, canActivate: [AuthGuard] },

      { path: 'budget', component: BudgetComponent, canActivate: [AuthGuard] },
      { path: 'budgetDelete/:sid', component: BudgetDeleteComponent, canActivate: [AuthGuard] },
      { path: 'budgetUpdate/:sid', component: BudgetUpdateComponent, canActivate: [AuthGuard] },

      { path: 'saving', component: SavingComponent, canActivate: [AuthGuard] },
      { path: 'savingUpdate/:sid', component: SavingUpdateComponent, canActivate: [AuthGuard] },
      { path: 'savingDelete/:sid', component: SavingDeleteComponent, canActivate: [AuthGuard] },

      { path: 'transaction', component: TransactionComponent, canActivate: [AuthGuard] },
      { path: 'transactionDelete/:sid', component: TransactionDeleteComponent, canActivate: [AuthGuard] },
      { path: 'transactionUpdate/:sid', component: TransactionUpdateComponent, canActivate: [AuthGuard] },

      { path: 'userProfile', component: UserProfileComponent, canActivate: [AuthGuard] },
      { path: 'userMenu', component: UserComponent, canActivate: [AuthGuard], data: { role: 'Admin' } },
      { path: 'adminMenu', component: AdminMenuComponent, canActivate: [AuthGuard], data: { role: 'Admin' } },
      { path: 'homeLayout', component: HomeLayoutComponent, canActivate: [AuthGuard], data: { role: 'Admin' } },
      /*    { path: 'userUpdate', component: UserUpdateComponent, canActivate: [AuthGuard], data: { role: 'Admin' } }*/

      { path: 'users/update/:id', component: UserUpdateComponent, canActivate: [AuthGuard], data: { role: 'Admin' } },
      { path: 'userDelete/:id', component: UserDeleteComponent, canActivate: [AuthGuard], data: { role: 'Admin' } }
    ],
  },

  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
    ],
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
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

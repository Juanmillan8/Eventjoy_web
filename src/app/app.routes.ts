import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SinginComponent } from './pages/auth/singin/singin.component';
import { AuthGuard, canActivate } from '@angular/fire/auth-guard';
import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';


export const routes: Routes = [
    {path:"home",component:HomeComponent,canActivate: [authGuard],data: { role: '*' }},
    {path:"profile",component:ProfileComponent,...canActivate(() => redirectUnauthorizedTo(["login"]))},
    {path:"login",component:LoginComponent},
    {path:"singin",component:SinginComponent},
    {path:"",redirectTo:"home",pathMatch:"full"},
    {path:"**",redirectTo:"home",pathMatch:"full"}

];

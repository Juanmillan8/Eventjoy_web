import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SinginComponent } from './pages/auth/singin/singin.component';
import { AuthGuard, canActivate } from '@angular/fire/auth-guard';
import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { GroupsComponent } from './pages/groups/groups.component';
import { GroupFormComponent } from './components/group/group-form/group-form.component';
import { GroupViewComponent } from './components/group/group-view/group-view.component';
import { EventFormComponent } from './components/event/event-form/event-form.component';
import { EventsComponent } from './pages/events/events.component';
import { ShowprofileComponent } from './pages/showprofile/showprofile.component';
import { ValorationsComponent } from './pages/valorations/valorations.component';


export const routes: Routes = [
    {path:"home",component:HomeComponent,canActivate: [authGuard],data: { role: '*' }},
    {path:"groups",component:GroupsComponent,canActivate: [authGuard],data: { role: '*' }},
    {path:"editgroup/:id",component:GroupFormComponent,canActivate: [authGuard],data: { role: '*' }},
    {path:"viewgroup/:id",component:GroupViewComponent,canActivate: [authGuard],data: { role: '*' }},
    {path:"events",component:EventsComponent,canActivate: [authGuard],data: { role: '*' }},
    {path:"editevent/:groupid/:eventid",component:EventFormComponent,canActivate: [authGuard],data: { role: '*' }},
    {path:"valorations",component:ValorationsComponent,...canActivate(() => redirectUnauthorizedTo(["login"]))},
    {path:"profile",component:ProfileComponent,...canActivate(() => redirectUnauthorizedTo(["login"]))},
    {path:"showprofile/:userId",component:ShowprofileComponent,...canActivate(() => redirectUnauthorizedTo(["login"]))},
    {path:"login",component:LoginComponent},
    {path:"singin",component:SinginComponent},
    {path:"",redirectTo:"home",pathMatch:"full"},
    {path:"**",redirectTo:"home",pathMatch:"full"}

];

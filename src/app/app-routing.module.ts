import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./home-buyers/home-buyers.module').then(m => m.HomeBuyersModule)
  },
  {
    path: 'step5',
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./property-title-details/property-title-details.module').then(m => m.PropertyTitleDetailsModule)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'PageNotFound',
    component: PageNotFoundComponent
  },  
  {
    path: 'PageNotFound',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }

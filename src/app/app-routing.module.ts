import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommentsComponent } from './comments/comments.component';
import { FacebookLoginComponent } from './facebook-login/facebook-login.component';

const routes: Routes = [
  {
    path: 'comments',
    component: CommentsComponent
  },
  {
    path: '',
    component: FacebookLoginComponent
  },
  {
    path: 'facebook-login',
    component: FacebookLoginComponent
  },  
  {
    path : "",
    loadChildren : () => import('./auth/auth.module').then((authm) => authm.AuthModule)
  },
  {
    path : "",
    loadChildren : () => import('./panel/panel.module').then((authm) => authm.PanelModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

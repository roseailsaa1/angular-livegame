import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { TriviaGameComponent } from './trivia-game/trivia-game.component';
import { GoLiveComponent } from './go-live/go-live.component';
import { ConnectSocialplatformsComponent } from './connect-socialplatforms/connect-socialplatforms.component';
import { TriviaResultComponent } from './trivia-result/trivia-result.component';
import { LastCommentMobileComponent } from './last-comment-mobile/last-comment-mobile.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'broadcast',
    component: BroadcastComponent
  },
  {
    path: 'trivia-game',
    component: TriviaGameComponent
  },
  {
    path: 'trivia-game/:tId',
    component: TriviaGameComponent
  },
  {
    path: 'goLive',
    component: GoLiveComponent
  },
  {
    path: 'lastComment',
    component: LastCommentMobileComponent
  },
  {
    path: 'connectSocials',
    component: ConnectSocialplatformsComponent
  },
  {
    path: 'connectSocials/:token',
    component: ConnectSocialplatformsComponent
  },
  {
    path: 'connectSocials/:data',
    component: ConnectSocialplatformsComponent
  },
  {
    path: 'instagram',
    component: ConnectSocialplatformsComponent
  },
  {
    path: 'trivia-result/:sId',
    component: TriviaResultComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }

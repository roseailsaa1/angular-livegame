import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PanelRoutingModule } from './panel-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { TriviaGameComponent } from './trivia-game/trivia-game.component';
import { GoLiveComponent } from './go-live/go-live.component';
import { ConnectSocialplatformsComponent } from './connect-socialplatforms/connect-socialplatforms.component';
import { TriviaResultComponent } from './trivia-result/trivia-result.component';
import { LastCommentMobileComponent } from './last-comment-mobile/last-comment-mobile.component';


@NgModule({
  declarations: [  
    DashboardComponent, ProfileComponent, HeaderComponent, FooterComponent, BroadcastComponent, TriviaGameComponent, GoLiveComponent, ConnectSocialplatformsComponent, TriviaResultComponent, LastCommentMobileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PanelRoutingModule
  ]
})
export class PanelModule { }
    
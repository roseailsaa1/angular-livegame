import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommentsComponent } from './comments/comments.component';
import { DatePipe } from '@angular/common';
import { FacebookLoginComponent } from './facebook-login/facebook-login.component';
// import { BuilderModule } from '@builder.io/angular';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";

// Google login and Facebook login
import { FacebookLoginProvider, SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoLiveComponent } from './go-live/go-live.component';

@NgModule({
  declarations: [
    AppComponent,
    CommentsComponent,
    FacebookLoginComponent,
    GoLiveComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      progressBar: true
    }),
    SocialLoginModule
    // BuilderModule.forRoot('306059f01b6e4b05a53b5677131c25bf')
  ],
  providers: [DatePipe, {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [

        // facebook login
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider(
            '715443403200099'   // Facebook-App-ID-Goes-Here  live
            // '897503730915691'   // Facebook-App-ID-Goes-Here  My
          )
        }
      ]
    } as SocialAuthServiceConfig,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

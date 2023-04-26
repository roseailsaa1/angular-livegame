import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommentService } from '../comment.service'
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrserviceService } from '../services/notification/toastrservice.service';
import { NgxSpinnerService } from "ngx-spinner";

import { SocialAuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-facebook-login',
  templateUrl: './facebook-login.component.html',
  styleUrls: ['./facebook-login.component.css']
})
export class FacebookLoginComponent implements OnInit {

  socialUser!: SocialUser;
  isLoggedin: boolean = false;
  facebooktokenresult: any;
  message: any;

  constructor(private socialAuthService: SocialAuthService, private router: Router, private commentSer: CommentService, private spinnerService: NgxSpinnerService, private toastr: ToastrserviceService) {
    if (localStorage.getItem("isLoggedIn")) {
      this.isLoggedin = true;
      this.router.navigate(['/dashboard']);
    } else {
      this.isLoggedin = false;
      this.router.navigate(['/']);
    }
  }

  timeLeft = 41;
  timerId: any;
  elem: any;
  countdown() {
    if (this.timeLeft == 0) {
      clearTimeout(this.timerId);
    } else {
      if (this.timeLeft > 60 && this.timeLeft <= 3600) {
        var m = Math.floor(this.timeLeft / 60);
        var s = Math.floor(this.timeLeft % 3600 % 60);        
        const mprefix = m < 10 ? '0' : '';
        const sprefix = s < 10 ? '0' : '';
        this.elem = `${mprefix}${m}:${sprefix}${s}`;
        console.log(this.elem);        
      } else if (this.timeLeft > 3600 && this.timeLeft <= 86400) {
        var h = Math.floor(this.timeLeft / 3600);
        var m = Math.floor(this.timeLeft % 3600 / 60);
        var s = Math.floor(this.timeLeft % 3600 % 60);
        const hprefix = h < 10 ? '0' : '';
        const mprefix = m < 10 ? '0' : '';
        const sprefix = s < 10 ? '0' : '';
        this.elem = `${hprefix}${h}:${mprefix}${m}:${sprefix}${s}`;
        console.log(this.elem);
      }else{
        console.log(this.timeLeft);        
        this.elem = this.timeLeft;
      }
      this.timeLeft--;
    }
  }
  ngOnInit() {
    // this.timerId = setInterval(() => { this.countdown() }, 1000);
  }

  loginWithFacebook(): void {
    const fbLoginOptions = {
      scope: 'email,pages_show_list,public_profile,pages_read_engagement,pages_manage_posts,groups_access_member_info, publish_to_groups,publish_video'
    };

    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID, fbLoginOptions);
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = (user != null);
      localStorage.setItem("facebookUserId", this.socialUser.id);
      this.getFacebookAccessToken();
    });
  }


  getFacebookAccessToken() {
    this.spinnerService.show();
    this.commentSer.getNewFacebookAccessToken(this.socialUser.authToken).subscribe((result: any) => {
      this.spinnerService.hide();
      if (result) {
        this.facebooktokenresult = result;
        localStorage.setItem("facebooktoken", this.facebooktokenresult.access_token);
        const formData = new FormData();
        formData.append('emailID', this.socialUser.email)
        formData.append('token', this.facebooktokenresult.access_token)
        formData.append('social_id', this.socialUser.id)
        formData.append('first_name', this.socialUser.firstName)
        formData.append('last_name', this.socialUser.lastName)
        formData.append('social_pic', this.socialUser.photoUrl)
        this.spinnerService.show();
        this.commentSer.socialLogin(formData).subscribe((result: any) => {
          this.spinnerService.hide();
          if (result["status"] == 1) {
            this.message = result["message"];
            localStorage.setItem('isLoggedIn', "true");
            localStorage.setItem("userData", JSON.stringify(result["result"]));
            this.router.navigate(['/dashboard']);
            this.toastr.showSuccess(this.message, "Success!");
          } else if (result["status"] == 0) {
            this.message = result["message"];
            this.toastr.showError(this.message, "Sorry!");
          }
        });
      } else {
        console.log("Something went wrong...");
        // this.toastr.showError("Something went wrong...", "Sorry!");
      }
    },
      (error: HttpErrorResponse) => {
        console.log("Something went wrong..." + error);
        // this.toastr.showInfo(error.error.message, "Information!");
      })
  }

}

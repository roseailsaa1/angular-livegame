import { Component, OnInit } from '@angular/core';

import { CommentService } from '../../comment.service'
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrserviceService } from '../../services/notification/toastrservice.service';
import { NgxSpinnerService } from "ngx-spinner";

import { SocialAuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  
  socialUser!: SocialUser;
  isLoggedin: boolean = false;
  facebooktokenresult: any;
  message: any;

  constructor(private socialAuthService: SocialAuthService, private commentSer: CommentService, private spinnerService: NgxSpinnerService, private toastr: ToastrserviceService) { }

  ngOnInit(): void {
    // console.log(localStorage.getItem("userData"));
    if (localStorage.getItem("isLoggedIn")) {
      this.isLoggedin = true;
    } else {
      this.isLoggedin = false;
    }
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
            localStorage.setItem("userData", JSON.stringify(result["result"]));
            localStorage.setItem('isLoggedIn', "true");
            this.toastr.showSuccess(this.message, "Success!");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else if (result["status"] == 0) {
            this.message = result["message"];
            this.toastr.showError(this.message, "Sorry!");
          }
        });
      } else {
        console.log("Something went wrong...");
        this.toastr.showError("Something went wrong...", "Sorry!");
      }
    },
      (error: HttpErrorResponse) => {
        console.log("Something went wrong..." + error);
        this.toastr.showInfo(error.error.message, "Information!");
      })
  }

  
  logout() {
    localStorage.setItem('isLoggedIn', "false");
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem("userData");
    this.socialAuthService.signOut();
    localStorage.setItem("facebooktoken", "");
    localStorage.removeItem("facebooktoken");
    localStorage.setItem("facebookUserId", "");
    localStorage.removeItem("facebookUserId");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

}

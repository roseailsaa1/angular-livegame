import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/stream/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrserviceService } from '../../services/notification/toastrservice.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userInfo: any;
  message: any = "";
  triviaGameList: any = [];

  constructor(private commonservice: CommonService, private router: Router, private spinnerService: NgxSpinnerService, private toastr: ToastrserviceService) {
    if (!(localStorage.getItem("isLoggedIn"))) {
      console.log("Session Expire");
      this.toastr.showError("Please Login Again", "Session Expire!");
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.userInfo = localStorage.getItem("userData");
    this.userInfo = JSON.parse(this.userInfo);
    this.getUserTriviaGame();
  }


  getUserTriviaGame() {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    this.spinnerService.show();
    this.commonservice.getUserTriviaGame(formData).subscribe((result: any) => {
      this.spinnerService.hide();
      if (result["status"] == 1) {
        if (result["result"]) {
          this.triviaGameList = result["result"];
        }
      } else if (result["status"] == 0) {
        this.message = result["message"];
        // this.toastr.showError(this.message, "Sorry!");
      } else {
        this.toastr.showError("Please Login Again", "Session Expire!");
        this.router.navigate(['/']);
      }
    },
      (error: HttpErrorResponse) => {
        this.toastr.showInfo(error.error.message, "Information!");
      })
  }

  deleteTriviaGame(triviaId: any) {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('triviaId', triviaId)
    this.spinnerService.show();
    this.commonservice.deleteTriviaGame(formData).subscribe((result: any) => {
      this.spinnerService.hide();
      if (result["status"] == 1) {
        this.message = result["message"];
        this.toastr.showSuccess(this.message, "Success!");
        this.getUserTriviaGame();
      } else if (result["status"] == 0) {
        this.message = result["message"];
        this.toastr.showError(this.message, "Sorry!");
      } else {
        this.toastr.showError("Please Login Again", "Session Expire!");
        this.router.navigate(['/']);
      }
    },
      (error: HttpErrorResponse) => {
        this.toastr.showInfo(error.error.message, "Information!");
      })
  }

}

import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from "rxjs";
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  
  rooturl = "https://easestream.com";

  constructor(private http: HttpClient) { }

  
  deleteAllComments() {
    return this.http.delete("https://media.easestream.com:5443/LiveApp/rest/stamp/instructions")
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }
    
  sendInstruction(data:any) {
    return this.http.post("https://media.easestream.com:5443/LiveApp/rest/stamp/instructions", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  getNewFacebookAccessToken(data: any) {
    return this.http.get("https://graph.facebook.com/v12.0/oauth/access_token?grant_type=fb_exchange_token&client_id=715443403200099&client_secret=aade50e4651dff2861444af61bec1331&grant_type=fb_exchange_token&fb_exchange_token=" + data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  socialLogin(data:any) {
    return this.http.post(this.rooturl + "/v3-social-login", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  createBroadcast(data:any) {
    return this.http.post(this.rooturl + "/v3-create-broadcast", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  stopBroadcast(data:any) {
    return this.http.post(this.rooturl + "/v3-stop-broadcast", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  allComments(data:any) {
    return this.http.post(this.rooturl + "/v3-all-comments", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  storeLastComments(data:any) {
    return this.http.post(this.rooturl + "/v3-store-last-comments", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  allComments2(fbBroadcastId:any, fbAccessToken:any) {
    return this.http.get("https://graph.facebook.com/v12.0/" + fbBroadcastId + "/comments?access_token="+ fbAccessToken)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  updateProductData(data:any){

  }
  
  // https://graph.facebook.com/v12.0/"+ fbBroadcastId + "/comments?access_token="+ fbAccessToken;
}

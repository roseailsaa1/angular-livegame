import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from "rxjs";
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocialsService {

  rooturl = "https://easestream.com";
  instarooturl = "https://easestream.com:3000/v1";

  constructor(private http: HttpClient) { }
  
  setCustomRtmp(data: any) {
    return this.http.post(this.rooturl + "/v3-set-custom-rmtp", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }
  
  getSocialEndpoint(data: any) {
    return this.http.post(this.rooturl + "/v3-get-social-endpoint", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  removeSocialEndpoint(data: any) {
    return this.http.post(this.rooturl + "/v3-remove-social-endpoint", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  instaLogin(data: any) {
    return this.http.post(this.instarooturl + "/v3-insta-login", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  instagramTwoFactorVerification(data: any) {
    return this.http.post(this.instarooturl + "/v3-insta-two-factor-varification", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  createInstaStreaming(data: any) {
    return this.http.post(this.instarooturl + "/v3-create-insta-streaming", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  startInstaStreaming(data: any) {
    return this.http.post(this.rooturl + "/v3-start-instagram", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  startInstaStreamingOld(instaToken: any, bId:any) {
    return this.http.get("https://rtmp.in/" + instaToken + "/start?bid=" + bId)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  stopInstaStreaming(data: any) {
    return this.http.post(this.instarooturl + "/v3-stop-insta-streaming", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  saveInstaToken(data: any) {
    return this.http.post(this.rooturl + "/v3-save-instagram-token", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from "rxjs";
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {


  rooturl = "https://easestream.com";

  constructor(private http: HttpClient) { }

  createBroadcast(data: any) {
    return this.http.post(this.rooturl + "/v3-create-broadcast", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  stopBroadcast(data: any) {
    return this.http.post(this.rooturl + "/v3-stop-broadcast", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  getQuestions(data: any) {
    return this.http.post(this.rooturl + "/v3-get-questions", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  generateTriviaQuestions(data: any) {
    return this.http.post(this.rooturl + "/v3-generate-trivia-question", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  getTriviaGame() {
    return this.http.get(this.rooturl + "/v3-get-trivia-game")
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  allComments(data: any) {
    return this.http.post(this.rooturl + "/v3-all-comments", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  storeTriviaComments(data: any) {
    return this.http.post(this.rooturl + "/v3-store-trivia-comments", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  getQuestionsComments(data: any) {
    return this.http.post(this.rooturl + "/v3-get-questions-comments", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }
  
  createTriviaGame(data: any) {
    return this.http.post(this.rooturl + "/v3-create-trivia-game", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  saveTriviaGame(data: any) {
    return this.http.post(this.rooturl + "/v3-save-trivia-game", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  getUserTriviaGame(data: any) {
    return this.http.post(this.rooturl + "/v3-get-user-trivia-game", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  deleteTriviaGame(data: any) {
    return this.http.post(this.rooturl + "/v3-delete-trivia-game", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  getTriviaLeaderboard(data: any) {
    return this.http.post(this.rooturl + "/v3-get-trivia-leaderboard", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  deleteTriviaQuestion(data: any) {
    return this.http.post(this.rooturl + "/v3-delete-trivia-question", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }

  addTriviaQuestions(data: any) {
    return this.http.post(this.rooturl + "/v3-add-trivia-question", data)
      .pipe(
        retry(1),
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      )
  }


}

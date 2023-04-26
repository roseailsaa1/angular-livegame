import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { WebRTCAdaptor } from '@antmedia/webrtc_adaptor';
import { CommonService } from '../../services/stream/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrserviceService } from '../../services/notification/toastrservice.service';
import { NgxSpinnerService } from "ngx-spinner";
import { SocialsService } from '../../services/stream/socials.service';


@Component({
  selector: 'app-trivia-game',
  templateUrl: './trivia-game.component.html',
  styleUrls: ['./trivia-game.component.css']
})
export class TriviaGameComponent implements OnInit {

  //webrtc
  webrtcAdaptor: any;
  token: any;
  pc_config: any = null;
  sdpConstraintsPublish: any;
  mediaConstraintsPublish: any;
  websocketURL!: string;
  streamId: any;
  infodata: string = '';
  @ViewChild('div') div!: ElementRef;

  isSend: boolean = false;
  commentsArr: any = [];
  canvas: any;
  vid: any;
  video: any;
  inputbox: any;
  id: any = 0;
  localCameraView: any;
  userInfo: any;
  fbBroadcastId: any;
  fbAccessToken: any;
  instagrambId: any;
  instagramtoken: any;

  defaultInterval: any;
  startScreenInterval: any;
  firstScreenInterval: any;
  secondScreenInterval: any;
  thirdScreenInterval: any;
  forthScreenInterval: any;
  triviaCommentInterval: any;
  winnerScreenInterval: any;

  winTime: string = "02:00";

  firstScreenTime: string = "01:00";
  secondScreenTime: any = 30;
  thirdScreenTime: any = 30;
  startScreenTime: any = 20;

  screenbgImg1: any = new Image();
  screenbgImg2: any = new Image();
  screenbgImg3: any = new Image();
  screenbgImg4: any = new Image();
  logoImg: any = new Image();
  avatar1: any = new Image();

  winner1: any = new Image();
  winner2: any = new Image();
  winner3: any = new Image();
  winner4: any = new Image();
  winner5: any = new Image();
  winner1name: any;
  winner2name: any;
  winner3name: any;
  winner4name: any;
  winner5name: any;
  winner1point: string = "";
  winner2point: string = "";
  winner3point: string = "";
  winner4point: string = "";
  winner5point: string = "";

  option1: any = new Image();
  option2: any = new Image();
  option3: any = new Image();
  option4: any = new Image();
  option5: any = new Image();

  question: string = "";
  op1: string = "";
  op2: string = "";
  op3: string = "";
  op4: string = "";

  questionArray: any = [];
  questionArrayLength: any = 0;
  questionResultOption1: any = [];
  questionResultOption2: any = [];
  questionResultOption3: any = [];
  questionResultOption4: any = [];

  avatarOption1a: any = new Image();
  avatarOption1b: any = new Image();
  avatarOption2a: any = new Image();
  avatarOption2b: any = new Image();
  avatarOption3a: any = new Image();
  avatarOption3b: any = new Image();
  avatarOption4a: any = new Image();
  avatarOption4b: any = new Image();

  timer: any;
  timer1: any;
  timer2: any;
  timer3: any;
  starttimer: any;

  message: any = "";
  after: any = "";
  questionId: any;
  qi: any = 0;
  questionIndex: any;
  optionIndex: any;
  answerresult: boolean = false;
  timerPause: boolean = false;
  skipQuestion: boolean = false;
  showSkipButton: boolean = false;
  showSkipEndButton: boolean = true;
  leaderboardArray: any = [];

  triviaId: any;
  triviaQuestionForm!: FormGroup;
  generatetriviaQuestionForm!: FormGroup;
  addTriviaQuestionForm!: FormGroup;
  fontFamilyList: any = ["Aleo", "Amatic SC", "Anton", "Cabin", "Charm", "Dancing Script", "Dosis", "Eczar", "Itim", "Kanit", "Lato", "Lobster", "Major Mono Display", "Montserrat", "Noto Serif JP", "Open Sans", "Oswald", "Pacifico", "Poppins", "Pridi", "Quicksand", "Raleway", "Righteous", "Roboto Condensed", "Roboto", "Rubik", "Thasadith", "Work Sans", "29LT Bukra"];
  s1TimerList: any = ["1", "2", "3", "4", "5"];
  gameTitle: string = "LIVE TRIVIA GAME";
  gameTitlePadding: any = 40;
  gameSubtitle: string = "Stay tuned! Starting in";
  gameSubtitlePadding: any = 60;
  gameFont: string = "Roboto";
  gameColor: string = "#FBF6F6";
  firstScreenTimeNew: any = 1;

  questionQuest: string = "Question";
  questionGameExp: string = "*Comment 1,2,3 or 4 + answer text to answer. One entry per question.";
  questionFont: string = "Roboto";
  questionColor: string = "#FBF6F6";
  questionTime: any = 30;

  questionEndResultOfQuest: string = "Results of question";
  questionEndOthers: string = "Others";
  questionEndNextQuest: string = "Next question in";
  questionEndComputingAns: string = "Computing Answer...";
  questionEndFont: string = "Roboto";
  questionEndColor: string = "#FBF6F6";
  questionEndOptionColor: string = "#000";
  questionEndTime: any = 30;

  gameEndLeaderboard: string = "Leadboard";
  gameEndWinners: string = "Winners";
  gameEndFont: string = "Roboto";
  gameEndColor: string = "#FBF6F6";

  fs1: boolean = false;
  ss1: boolean = false;
  ts1: boolean = false;
  fos1: boolean = false;

  socialChannelData: string = "";
  socialChannelArray: any = [];
  userSocialStatus: any;
  facebookConnected: boolean = false;
  instagramConnected: boolean = false;

  constructor(private commonservice: CommonService, private social: SocialsService, public datepipe: DatePipe, private router: Router, private activateRoute: ActivatedRoute, public sanitizer: DomSanitizer, private spinnerService: NgxSpinnerService, private toastr: ToastrserviceService) {
    if (!(localStorage.getItem("isLoggedIn"))) {
      this.toastr.showError("Please Login Again", "Session Expire!");
      this.router.navigate(['/']);
    }
    this.screenbgImg1.src = "./assets/images/bg1.jpg";
    this.screenbgImg2.src = "./assets/images/bg1.jpg";
    this.screenbgImg3.src = "./assets/images/bg1.jpg";
    this.screenbgImg4.src = "./assets/images/bg1.jpg";
    this.logoImg.src = "./assets/images/logo.png";
    this.avatar1.src = "./assets/images/avatar1.png";

    this.winner1.src = "./assets/images/avatar2.png";
    this.winner2.src = "./assets/images/avatar2.png";
    this.winner3.src = "./assets/images/avatar2.png";
    this.winner4.src = "./assets/images/avatar2.png";
    this.winner5.src = "./assets/images/avatar2.png";

    this.option1.src = "./assets/images/option1.png";
    this.option2.src = "./assets/images/option2.png";
    this.option3.src = "./assets/images/option3.png";
    this.option4.src = "./assets/images/option4.png";
    this.option5.src = "./assets/images/option5.png";

    this.avatarOption1a.src = "./assets/images/avatar2.png";
    this.avatarOption1b.src = "./assets/images/avatar2.png";
    this.avatarOption2a.src = "./assets/images/avatar2.png";
    this.avatarOption2b.src = "./assets/images/avatar2.png";
    this.avatarOption3a.src = "./assets/images/avatar2.png";
    this.avatarOption3b.src = "./assets/images/avatar2.png";
    this.avatarOption4a.src = "./assets/images/avatar2.png";
    this.avatarOption4b.src = "./assets/images/avatar2.png";

    this.webrtcAdaptor = null;

    // ant media
    this.token = "";
    this.pc_config = null;

    // var path =  location.hostname + ":5443"+"/WebRTCAppEE/websocket";
    let path = "developer.easestream.com:5080/LiveApp/websocket";
    this.websocketURL = "ws://" + path;

    if (location.protocol.startsWith("https")) {
      this.websocketURL = "wss://" + "developer.easestream.com:5443/LiveApp/websocket";
    }

    this.sdpConstraintsPublish = {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false
    };

    this.mediaConstraintsPublish = {
      video: {
        width: { ideal: 720 }, height: { ideal: 1280 }
      },
      audio: true
    };

  }

  initWebrtc(localStream: any) {
    this.webrtcAdaptor = new WebRTCAdaptor({
      websocket_url: this.websocketURL,
      mediaConstraints: this.mediaConstraintsPublish,
      peerconnection_config: this.pc_config,
      sdp_constraints: this.sdpConstraintsPublish,
      localVideoId: "localVideo",
      localStream: localStream,
      remoteVideoId: "localVideo",
      bandwidth: 2000,
      debug: true,
      isPlayMode: true,
      dataChannelEnabled: true,
      callback: (info: any, description: any) => {
        this.infodata = info;
        // console.log("Info ", info);
        if (info == "initialized") {
        } else if (info == "pong") {
        } else if (info == "publish_started") {
          this.startScreenInterval = setInterval(() => {
            clearInterval(this.defaultInterval);
            this.startScreen();
          }, 1000 / 30);
          this.startScreenTimer();
        } else if (info == "publish_finished") {
        } else if (info == "data_received") {
          console.log(description);
        } else if (info == "available_devices") {
        } else if (info == "closed") {
          if (typeof description != "undefined") {
            this.webrtcAdaptor = null;
            this.initWebrtc('');
          }
        }
      },
      callbackError: (error: any, message: any) => {
        console.log("error callback: " + JSON.stringify(error));
        var errorMessage = JSON.stringify(error);
        if (typeof message != "undefined") {
          errorMessage = message;
          this.toastr.showError(errorMessage, "undefined!");
        }
        var errorMessage = JSON.stringify(error);
        if (error.indexOf("NotFoundError") != -1) {
          errorMessage = "Camera or Mic are not found or not allowed in your device";
          this.toastr.showError(errorMessage, "NotFoundError!");
        }
        else if (error.indexOf("NotReadableError") != -1 || error.indexOf("TrackStartError") != -1) {
          errorMessage = "Camera or Mic is being used by some other process that does not let read the devices";
          this.toastr.showError(errorMessage, "NotReadableError!");
        }
        else if (error.indexOf("OverconstrainedError") != -1 || error.indexOf("ConstraintNotSatisfiedError") != -1) {
          errorMessage = "There is no device found that fits your video and audio constraints. You may change video and audio constraints";
          this.toastr.showError(errorMessage, "OverconstrainedError!");
        }
        else if (error.indexOf("NotAllowedError") != -1 || error.indexOf("PermissionDeniedError") != -1) {
          errorMessage = "You are not allowed to access camera and mic.";
          this.toastr.showError(errorMessage, "NotAllowedError!");
        }
        else if (error.indexOf("TypeError") != -1) {
          errorMessage = "Video/Audio is required";
          this.toastr.showError(errorMessage, "TypeError!");
        }
        else if (error.indexOf("publishTimeoutError") != -1) {
          console.log("publish timeout error caught, Correct Start stream label", error);
          this.toastr.showError("publish timeout error caught, Correct Start stream label", "publishTimeoutError!");
          this.webrtcAdaptor = null;
        } else {
          this.toastr.showError("Please Login Again", "Session Expire!");
          this.router.navigate(['/']);
        }
      }
    });
  }

  ngOnInit(): void {
    this.userInfo = localStorage.getItem("userData");
    this.userInfo = JSON.parse(this.userInfo);
    if (this.activateRoute.snapshot.params["tId"]) {
      this.triviaId = this.activateRoute.snapshot.params["tId"];
      this.getUserTriviaGame();
    } else {
      this.getTriviaGame();
      this.createTriviaGame();
    }

    this.getSocialEndpoint();

    this.triviaQuestionForm = new FormGroup({
      gameS1Title: new FormControl(this.gameTitle),
      gameS1TitlePadding: new FormControl(this.gameTitlePadding),
      gameS1Subtitle: new FormControl(this.gameSubtitle),
      gameS1SubtitlePadding: new FormControl(this.gameSubtitlePadding),
      gameS1Timer: new FormControl(this.firstScreenTimeNew),
      gameS1Font: new FormControl(this.gameFont),
      gameS1Color: new FormControl(this.gameColor),
      gameS1BgImg: new FormControl(''),

      gameS2Question: new FormControl(this.questionQuest),
      gameS2GameExp: new FormControl(this.questionGameExp),
      gameS2Timer: new FormControl(this.questionTime),
      gameS2Font: new FormControl(this.questionFont),
      gameS2Color: new FormControl(this.questionColor),
      gameS2BgImg: new FormControl(''),

      gameS3ResultOfQuest: new FormControl(this.questionEndResultOfQuest),
      gameS3NextQuest: new FormControl(this.questionEndNextQuest),
      gameS3ComputingAns: new FormControl(this.questionEndComputingAns),
      // gameS3Others: new FormControl(this.questionEndOthers),
      gameS3Timer: new FormControl(this.questionEndTime),
      gameS3Font: new FormControl(this.questionEndFont),
      gameS3Color: new FormControl(this.questionEndColor),
      gameS3OptionColor: new FormControl(this.questionEndOptionColor),
      gameS3BgImg: new FormControl(''),

      gameS4Leaderboard: new FormControl(this.gameEndLeaderboard),
      gameS4Winners: new FormControl(this.gameEndWinners),
      gameS4Font: new FormControl(this.gameEndFont),
      gameS4Color: new FormControl(this.gameEndColor),
      gameS4BgImg: new FormControl(''),
    });

    this.generatetriviaQuestionForm = new FormGroup({
      questionNumber: new FormControl('5'),
    });


    this.addTriviaQuestionForm = new FormGroup({
      question: new FormControl('', Validators.required),
      option1: new FormControl('', Validators.required),
      option2: new FormControl('', Validators.required),
      option3: new FormControl('', Validators.required),
      option4: new FormControl('', Validators.required),
    });
  }

  get f() {
    return this.addTriviaQuestionForm.controls;
  }

  getTriviaGame() {
    this.spinnerService.show();
    this.commonservice.getTriviaGame().subscribe((result: any) => {
      this.spinnerService.hide();
      if (result["status"] == 1) {
        if (result["result"]) {
          this.gameTitle = result["result"].gameTitle;
          this.gameTitlePadding = result["result"].gameTitlePadding;
          this.gameSubtitle = result["result"].gameSubtitle;
          this.gameSubtitlePadding = result["result"].gameSubtitlePadding;
          this.gameFont = result["result"].gameFont;
          this.firstScreenTimeNew = result["result"].firstScreenTime;
          this.gameColor = result["result"].gameColor;
          this.questionColor = result["result"].questionColor;
          this.questionFont = result["result"].questionFont;
          this.questionTime = result["result"].questionTime;
          this.questionGameExp = result["result"].questionGameExp;
          this.questionQuest = result["result"].questionQuest;
          this.questionEndOptionColor = result["result"].questionEndOptionColor;
          this.questionEndColor = result["result"].questionEndColor;
          this.questionEndFont = result["result"].questionEndFont;
          this.questionEndTime = result["result"].questionEndTime;
          this.questionEndComputingAns = result["result"].questionEndComputingAns;
          this.questionEndNextQuest = result["result"].questionEndNextQuest;
          this.questionEndOthers = result["result"].questionEndOthers;
          this.questionEndResultOfQuest = result["result"].questionEndResultOfQuest;
          this.gameEndColor = result["result"].gameEndColor;
          this.gameEndFont = result["result"].gameEndFont;
          this.gameEndWinners = result["result"].gameEndWinners;
          this.gameEndLeaderboard = result["result"].gameEndLeaderboard;
        }
        this.triviaQuestionForm = new FormGroup({
          gameS1Title: new FormControl(this.gameTitle),
          gameS1TitlePadding: new FormControl(this.gameTitlePadding),
          gameS1Subtitle: new FormControl(this.gameSubtitle),
          gameS1SubtitlePadding: new FormControl(this.gameSubtitlePadding),
          gameS1Timer: new FormControl(this.firstScreenTimeNew),
          gameS1Font: new FormControl(this.gameFont),
          gameS1Color: new FormControl(this.gameColor),
          gameS1BgImg: new FormControl(''),

          gameS2Question: new FormControl(this.questionQuest),
          gameS2GameExp: new FormControl(this.questionGameExp),
          gameS2Timer: new FormControl(this.questionTime),
          gameS2Font: new FormControl(this.questionFont),
          gameS2Color: new FormControl(this.questionColor),
          gameS2BgImg: new FormControl(''),

          gameS3ResultOfQuest: new FormControl(this.questionEndResultOfQuest),
          gameS3NextQuest: new FormControl(this.questionEndNextQuest),
          gameS3ComputingAns: new FormControl(this.questionEndComputingAns),
          // gameS3Others: new FormControl(this.questionEndOthers),
          gameS3Timer: new FormControl(this.questionEndTime),
          gameS3Font: new FormControl(this.questionEndFont),
          gameS3Color: new FormControl(this.questionEndColor),
          gameS3OptionColor: new FormControl(this.questionEndOptionColor),
          gameS3BgImg: new FormControl(''),

          gameS4Leaderboard: new FormControl(this.gameEndLeaderboard),
          gameS4Winners: new FormControl(this.gameEndWinners),
          gameS4Font: new FormControl(this.gameEndFont),
          gameS4Color: new FormControl(this.gameEndColor),
          gameS4BgImg: new FormControl(''),
        });
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

  getUserTriviaGame() {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('triviaId', this.triviaId)
    this.spinnerService.show();
    this.commonservice.getUserTriviaGame(formData).subscribe((result: any) => {
      this.spinnerService.hide();
      if (result["status"] == 1) {
        if (result["result"]) {
          this.triviaId = result["result"].triviaId;
          this.questionId = result["result"].questionId;
          this.gameTitle = result["result"].gameTitle;
          this.gameTitlePadding = result["result"].gameTitlePadding;
          this.gameSubtitle = result["result"].gameSubtitle;
          this.gameSubtitlePadding = result["result"].gameSubtitlePadding;
          this.gameFont = result["result"].gameFont;
          this.firstScreenTimeNew = result["result"].firstScreenTime;
          this.gameColor = result["result"].gameColor;
          this.questionColor = result["result"].questionColor;
          this.questionFont = result["result"].questionFont;
          this.questionTime = result["result"].questionTime;
          this.questionGameExp = result["result"].questionGameExp;
          this.questionQuest = result["result"].questionQuest;
          this.questionEndOptionColor = result["result"].questionEndOptionColor;
          this.questionEndColor = result["result"].questionEndColor;
          this.questionEndFont = result["result"].questionEndFont;
          this.questionEndTime = result["result"].questionEndTime;
          this.questionEndComputingAns = result["result"].questionEndComputingAns;
          this.questionEndNextQuest = result["result"].questionEndNextQuest;
          this.questionEndOthers = result["result"].questionEndOthers;
          this.questionEndResultOfQuest = result["result"].questionEndResultOfQuest;
          this.gameEndColor = result["result"].gameEndColor;
          this.gameEndFont = result["result"].gameEndFont;
          this.gameEndWinners = result["result"].gameEndWinners;
          this.gameEndLeaderboard = result["result"].gameEndLeaderboard;
        }

        this.triviaQuestionForm = new FormGroup({
          gameS1Title: new FormControl(this.gameTitle),
          gameS1TitlePadding: new FormControl(this.gameTitlePadding),
          gameS1Subtitle: new FormControl(this.gameSubtitle),
          gameS1SubtitlePadding: new FormControl(this.gameSubtitlePadding),
          gameS1Timer: new FormControl(this.firstScreenTimeNew),
          gameS1Font: new FormControl(this.gameFont),
          gameS1Color: new FormControl(this.gameColor),
          gameS1BgImg: new FormControl(''),

          gameS2Question: new FormControl(this.questionQuest),
          gameS2GameExp: new FormControl(this.questionGameExp),
          gameS2Timer: new FormControl(this.questionTime),
          gameS2Font: new FormControl(this.questionFont),
          gameS2Color: new FormControl(this.questionColor),
          gameS2BgImg: new FormControl(''),

          gameS3ResultOfQuest: new FormControl(this.questionEndResultOfQuest),
          gameS3NextQuest: new FormControl(this.questionEndNextQuest),
          gameS3ComputingAns: new FormControl(this.questionEndComputingAns),
          // gameS3Others: new FormControl(this.questionEndOthers),
          gameS3Timer: new FormControl(this.questionEndTime),
          gameS3Font: new FormControl(this.questionEndFont),
          gameS3Color: new FormControl(this.questionEndColor),
          gameS3OptionColor: new FormControl(this.questionEndOptionColor),
          gameS3BgImg: new FormControl(''),

          gameS4Leaderboard: new FormControl(this.gameEndLeaderboard),
          gameS4Winners: new FormControl(this.gameEndWinners),
          gameS4Font: new FormControl(this.gameEndFont),
          gameS4Color: new FormControl(this.gameEndColor),
          gameS4BgImg: new FormControl(''),
        });
        this.getQuestions();
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

  createTriviaGame() {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    this.spinnerService.show();
    this.commonservice.createTriviaGame(formData).subscribe((result: any) => {
      this.spinnerService.hide();
      if (result["status"] == 1) {
        this.triviaId = result["result"].triviaId;
        this.questionId = result["result"].questionId;
        this.getQuestions();
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

  getSocialEndpoint() {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('type', "web")
    this.spinnerService.show();
    this.social.getSocialEndpoint(formData).subscribe((result: any) => {
      this.spinnerService.hide();
      if (result["status"] == 1) {
        this.message = result["message"];
        this.userSocialStatus = result["result"];
        this.userSocialStatus.forEach((element: any) => {
          if (element.serviceName == "facebook") {
            this.facebookConnected = true;
          } else if (element.serviceName == "instagram") {
            this.instagramConnected = true;
          }
        });
      } else if (result["status"] == 0) {
        this.message = result["message"];
        this.toastr.showError(this.message, "Sorry!");
      }
    },
      (error: HttpErrorResponse) => {
        this.toastr.showInfo(error.error.message, "Information!");
      })
  }

  addNew(value: string) {
    if (this.socialChannelArray.indexOf(value) === -1) {
      this.socialChannelArray.push(value);
      this.socialChannelData = this.socialChannelArray.toString();
    } else {
      this.socialChannelArray.forEach((element: any, index: any) => {
        if (element == value) this.socialChannelArray.splice(index, 1);
      });
      this.socialChannelData = this.socialChannelArray.toString();
    }
  }

  goLive(data: any) {
    if (this.questionId == "") {
      this.toastr.showInfo("Please generates question first", "Information!");
    } else {
      const formData = new FormData();
      formData.append('userId', this.userInfo['id'])
      formData.append('streamName', "Testing")
      formData.append('socialChannel', data)
      formData.append('type', "web")
      this.spinnerService.show();
      this.commonservice.createBroadcast(formData).subscribe((result: any) => {
        this.spinnerService.hide();
        console.log(result);
        if (result["status"] == 1) {
          this.message = result["message"];
          this.streamId = result["streamId"];
          this.fbBroadcastId = result["fbBroadcastId"];
          this.fbAccessToken = result["fbAccessToken"];
          this.instagrambId = result["instagrambId"];
          this.instagramtoken = result["instagramtoken"];
          if (this.instagrambId != "" && this.instagramtoken != "") {
            this.startInstaStreaming(this.instagramtoken, this.instagrambId);
          }
          this.isSend = true;
          this.PublishStreaming(this.streamId);
          this.toastr.showSuccess(this.message, "Success!");
        } else if (result["status"] == 0) {
          this.message = result["message"];
          if (this.message) {
            this.toastr.showError(this.message, "Sorry!");
          } else {
            this.toastr.showError("Please Login Again", "Something Went Wrong!");
            this.router.navigate(['/']);
          }
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

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('canvas');
    this.vid = document.getElementById('localVideo');

    this.inputbox = new Image();

    this.inputbox.input = "";
    this.localCameraView = null;
    this.defaultInterval = setInterval(() => {
      this.firstScreen();
    }, 1000 / 30);
    var localCanvasStream = this.canvas.captureStream(25);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream: any) => {
      localCanvasStream.addTrack(stream.getAudioTracks()[0]);
      this.localCameraView = document.getElementById("localVideo");
      this.localCameraView.srcObject = stream;
      this.localCameraView.play();
      this.video = document.querySelector('video#localVideo');
      this.video.srcObject = stream;
      this.video.onloadedmetadata = (e: any) => {
        this.video.play();
      };
      this.initWebrtc(localCanvasStream);
    });
  }

  PublishStreaming(streamId: any) {
    this.webrtcAdaptor.publish(streamId, "", "", "", "", "", "");
  }

  StopPublishing() {
    this.isSend = false;
    this.webrtcAdaptor.stop(this.streamId);
    this.stopStreaming();
    this.webrtcAdaptor.closeStream();
  }

  stopStreaming() {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('streamId', this.streamId)
    formData.append('type', "web")
    this.commonservice.stopBroadcast(formData).subscribe((result: any) => {
      if (result["status"] == 1) {
        this.message = result["message"];
        this.toastr.showSuccess(this.message, "Success!");
        this.router.navigate(['/']);
      } else if (result["status"] == 0) {
        this.message = result["message"];
        this.toastr.showError(this.message, "Sorry!");
      }
    },
      (error: HttpErrorResponse) => {
        this.toastr.showInfo(error.error.message, "Information!");
      })
  }

  startInstaStreaming(instaToken: any, bId: any) {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('bid', bId)
    formData.append('token', instaToken)
    formData.append('type', "web")
    this.social.startInstaStreaming(formData).subscribe((result: any) => {
      console.log(result);
      if (result["status"] == 1) {
        this.message = result["message"];
        // this.toastr.showSuccess(this.message, "Success!");
        // this.router.navigate(['/']);
      } else if (result["status"] == 0) {
        this.message = result["message"];
        this.toastr.showError(this.message, "Sorry!");
      }
    },
      (error: HttpErrorResponse) => {
        this.toastr.showInfo(error.error.message, "Information!");
      })
  }


  getQuestions() {
    if (this.questionId == "") {

    } else {
      const formData = new FormData();
      formData.append('questionId', this.questionId)
      this.commonservice.getQuestions(formData).subscribe((result: any) => {
        if (result["status"] == 1) {
          this.questionArray = result["result"];
          this.questionArrayLength = result["result"].length;
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

  storeTriviaComments() {
    this.answerresult = false;
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('streamId', this.streamId)
    formData.append('fbAccessToken', this.fbAccessToken)
    formData.append('broadcastId', this.fbBroadcastId)
    formData.append('after', this.after)
    formData.append('questionId', this.questionIndex)
    formData.append('correctOptionId', this.optionIndex)
    formData.append('bid', this.instagrambId)
    formData.append('instagramtoken', this.instagramtoken)
    this.commonservice.storeTriviaComments(formData).subscribe((result: any) => {
      if (result["status"] == 1) {
        this.after = result["result"];
      } else if (result["status"] == 0) {
        // this.message = result["message"];
        // this.toastr.showError(this.message, "Sorry!");
      }
    },
      (error: HttpErrorResponse) => {
        // this.toastr.showInfo(error.error.message, "Information!");
      })
  }

  getQuestionsComments() {
    this.questionResultOption1 = [];
    this.questionResultOption2 = [];
    this.questionResultOption3 = [];
    this.questionResultOption4 = [];
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('streamId', this.streamId)
    formData.append('questionId', this.qi + 1)
    this.commonservice.getQuestionsComments(formData).subscribe((result: any) => {
      if (result["status"] == 1) {
        this.answerresult = true;
        this.questionResultOption1 = result["result"].option1;
        if (this.questionResultOption1.length >= 1) {
          this.avatarOption1a.src = this.questionResultOption1[0].profile;
        }
        if (this.questionResultOption1.length >= 2) {
          this.avatarOption1b.src = this.questionResultOption1[1].profile;
        }

        this.questionResultOption2 = result["result"].option2;
        if (this.questionResultOption2.length >= 1) {
          this.avatarOption2a.src = this.questionResultOption2[0].profile;
        }
        if (this.questionResultOption2.length >= 2) {
          this.avatarOption2b.src = this.questionResultOption2[1].profile;
        }

        this.questionResultOption3 = result["result"].option3;
        if (this.questionResultOption3.length >= 1) {
          this.avatarOption3a.src = this.questionResultOption3[0].profile;
        }
        if (this.questionResultOption3.length >= 2) {
          this.avatarOption3b.src = this.questionResultOption3[1].profile;
        }

        this.questionResultOption4 = result["result"].option4;
        if (this.questionResultOption4.length >= 1) {
          this.avatarOption4a.src = this.questionResultOption4[0].profile;
        }
        if (this.questionResultOption4.length >= 2) {
          this.avatarOption4b.src = this.questionResultOption4[1].profile;
        }

      } else if (result["status"] == 0) {
        // this.message = result["message"];
        // this.toastr.showError(this.message, "Sorry!");
      }
    },
      (error: HttpErrorResponse) => {
        // this.toastr.showInfo(error.error.message, "Information!");
      })
  }


  startScreen() {
    if (this.canvas.getContext && this.localCameraView != null) {
      var ctx = this.canvas.getContext('2d');
      this.canvas.width = 250 * 2;
      this.canvas.height = 500 * 2;
      ctx.scale(2, 2)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(this.localCameraView, 0, 0, 250, 500);
      ctx.drawImage(this.screenbgImg1, 0, 0, 250, 500);
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = "6";
      ctx.strokeStyle = "#fff";
      ctx.arc(125, 25, 2 * 10, 2 * 10, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(this.logoImg, 106, 8, 38, 38);
      ctx.stroke();
      ctx.restore();
      this.fs1 = true;
      /* 
        First screen for trivia game where user set title and subtitle with starting time for user to connect a game        
      */
      ctx.textAlign = "center";
      ctx.font = "17px '" + this.gameFont + "'";
      ctx.fillStyle = this.gameColor;
      ctx.fillText("GAME PREPARING...", 125, 245);
      ctx.font = "42px '" + this.gameFont + "'";
      ctx.fillStyle = this.gameColor;
      ctx.fillText(this.startScreenTime, 125, 305);
      /*
        end first screen code 
       */
    }
  }

  firstScreen() {
    if (this.canvas.getContext && this.localCameraView != null) {
      var ctx = this.canvas.getContext('2d');
      this.canvas.width = 250 * 2;
      this.canvas.height = 500 * 2;
      ctx.scale(2, 2)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(this.localCameraView, 0, 0, 250, 500);
      ctx.drawImage(this.screenbgImg1, 0, 0, 250, 500);
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = "6";
      ctx.strokeStyle = "#fff";
      ctx.arc(125, 25, 2 * 10, 2 * 10, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(this.logoImg, 106, 8, 38, 38);
      ctx.stroke();
      ctx.restore();
      this.fs1 = true;
      /* 
        First screen for trivia game where user set title and subtitle with starting time for user to connect a game        
      */
      ctx.font = "22px '" + this.gameFont + "'";
      ctx.textAlign = "center";
      ctx.fillStyle = this.gameColor;
      ctx.fillText(this.gameTitle, 125, 210);
      ctx.font = "17px '" + this.gameFont + "'";
      ctx.fillStyle = this.gameColor;
      ctx.fillText(this.gameSubtitle, 125, 245);
      ctx.font = "42px '" + this.gameFont + "'";
      ctx.fillStyle = this.gameColor;
      ctx.fillText(this.firstScreenTime, 125, 305);
      /*
        end first screen code 
       */
    }
  }

  secondScreen() {
    if (this.canvas.getContext && this.localCameraView != null) {
      var ctx = this.canvas.getContext('2d');
      this.canvas.width = 250 * 2;
      this.canvas.height = 500 * 2;
      ctx.scale(2, 2)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(this.localCameraView, 0, 0, 250, 500);
      ctx.drawImage(this.screenbgImg2, 0, 0, 250, 500);
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = "6";
      ctx.strokeStyle = "#fff";
      ctx.arc(125, 25, 2 * 10, 2 * 10, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(this.logoImg, 106, 8, 38, 38);
      ctx.stroke();
      ctx.restore();
      this.ss1 = true;
      /*
      start of question screen where user can see question with option
       */
      this.skipQuestion = false;
      this.showSkipButton = false;
      if (this.questionArrayLength == this.questionIndex) {
        this.showSkipEndButton = true;
      } else {
        this.showSkipEndButton = false;
      }
      this.question = this.questionArray[this.qi].question;
      this.op1 = this.questionArray[this.qi].options[0].options;
      this.op2 = this.questionArray[this.qi].options[1].options;
      this.op3 = this.questionArray[this.qi].options[2].options;
      this.op4 = this.questionArray[this.qi].options[3].options;
      this.questionIndex = this.qi + 1;

      this.optionIndex = ((this.questionArray[this.qi].options[0].is_correct == "1") ? 1 : ((this.questionArray[this.qi].options[1].is_correct == "1") ? 2 : ((this.questionArray[this.qi].options[2].is_correct == "1") ? 3 : 4)))

      ctx.font = "10px '" + this.questionFont + "'";

      ctx.fillStyle = this.questionColor;
      ctx.fillText(this.questionQuest + this.questionIndex + "/" + this.questionArrayLength, 10, 30);
      ctx.textAlign = "center";
      ctx.font = "bold 15px '" + this.questionFont + "'";
      ctx.fillStyle = this.questionColor;
      let wrappedText = this.wrapText(ctx, this.question, 125, 80, 220, 20);
      wrappedText.forEach((item: any) => {
        ctx.fillText(item[0], item[1], item[2]);
      })

      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      ctx.roundRect(24, 200, 200, 35, 5);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
      ctx.restore();
      ctx.drawImage(this.option1, 27, 204, 28, 28);
      ctx.font = "bold 15px '" + this.questionFont + "'";
      ctx.fillStyle = "#000";
      ctx.fillText(this.op1, 125, 223);

      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      ctx.roundRect(24, 245, 200, 35, 5);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
      ctx.restore();
      ctx.drawImage(this.option2, 27, 249, 28, 28);
      ctx.font = "bold 15px '" + this.questionFont + "'";
      ctx.fillStyle = "#000";
      ctx.fillText(this.op2, 125, 268);

      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      ctx.roundRect(24, 290, 200, 35, 5);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
      ctx.restore();
      ctx.drawImage(this.option3, 27, 294, 28, 28);
      ctx.font = "bold 15px '" + this.questionFont + "'";
      ctx.fillStyle = "#000";
      ctx.fillText(this.op3, 125, 314);

      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      ctx.roundRect(24, 335, 200, 35, 5);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
      ctx.restore();
      ctx.drawImage(this.option4, 27, 339, 28, 28);
      ctx.font = "bold 15px '" + this.questionFont + "'";
      ctx.fillStyle = "#000";
      ctx.fillText(this.op4, 125, 360);

      ctx.font = "10px '" + this.questionFont + "'";
      ctx.fillStyle = this.questionColor;

      let wrappedText1 = this.wrapText(ctx, this.questionGameExp, 125, 484, 220, 12);
      wrappedText1.forEach((item: any) => {
        ctx.fillText(item[0], item[1], item[2]);
      })

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = "7";
      ctx.strokeStyle = "#fff";
      ctx.arc(125, 425, 2 * 15, 2 * 15, Math.PI * 2, true);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
      ctx.font = "bold 17px '" + this.questionFont + "'";
      ctx.fillStyle = "#000";
      ctx.fillText(this.secondScreenTime, 125, 433);

      /*
        end of question screen
      */
    }
  }

  thirdScreen() {
    if (this.canvas.getContext && this.localCameraView != null) {
      var ctx = this.canvas.getContext('2d');
      this.canvas.width = 250 * 2;
      this.canvas.height = 500 * 2;
      ctx.scale(2, 2)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(this.localCameraView, 0, 0, 250, 500);
      ctx.drawImage(this.screenbgImg3, 0, 0, 250, 500);
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = "6";
      ctx.strokeStyle = "#fff";
      ctx.arc(125, 25, 2 * 10, 2 * 10, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(this.logoImg, 106, 8, 38, 38);
      ctx.stroke();
      ctx.restore();
      this.ts1 = true;
      /*
        start of question result screen
       */
      this.question = this.questionArray[this.qi].question;
      this.op1 = this.questionArray[this.qi].options[0].options;
      this.op2 = this.questionArray[this.qi].options[1].options;
      this.op3 = this.questionArray[this.qi].options[2].options;
      this.op4 = this.questionArray[this.qi].options[3].options;

      ctx.font = "10px '" + this.questionEndFont + "'";
      ctx.fillStyle = this.questionEndColor;
      ctx.fillText(this.questionEndResultOfQuest + " " + (this.qi + 1), 10, 30);
      ctx.fillText(this.questionEndNextQuest + " " + this.thirdScreenTime, 170, 30);
      ctx.textAlign = "center";
      ctx.font = "bold 15px '" + this.questionEndFont + "'";
      ctx.fillStyle = this.questionEndColor;
      let wrappedText = this.wrapText(ctx, this.question, 125, 80, 220, 20);
      wrappedText.forEach((item: any) => {
        ctx.fillText(item[0], item[1], item[2]);
      })

      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      ctx.roundRect(24, 190, 200, 30, 5);
      if (this.answerresult) {
        if (this.questionArray[this.qi].options[0].is_correct == '1') {
          ctx.fillStyle = "#EC6608";
        } else {
          ctx.fillStyle = "#000000";
        }
      } else {
        ctx.fillStyle = "#000";
      }
      ctx.fill();
      ctx.closePath();
      ctx.restore();
      ctx.drawImage(this.option1, 27, 194, 22, 22);
      ctx.font = "bold 12px '" + this.questionEndFont + "'";
      ctx.fillStyle = this.questionEndOptionColor;
      ctx.fillText(this.op1, 125, 210);

      if (this.answerresult) {
        if (this.questionResultOption1.length == 0) {
          ctx.font = "14px '" + this.questionEndFont + "'";
          ctx.fillStyle = this.questionEndColor;
          ctx.fillText("No Comments Found", 125, 240);
        } else {
          if (this.questionResultOption1.length >= 1) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "#000b0d";
            ctx.arc(75, 242, 2 * 10, 2 * 10, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(this.avatarOption1a, 55, 224, 38, 38);
            ctx.stroke();
            ctx.restore();
          }
          if (this.questionResultOption1.length >= 2) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = "6";
            ctx.strokeStyle = "#000b0d";
            ctx.arc(116, 242, 2 * 10, 2 * 10, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(this.avatarOption1b, 98, 224, 38, 38);
            ctx.stroke();
            ctx.restore();
          }
        }
      } else {
        ctx.font = "14px '" + this.questionEndFont + "'";
        ctx.fillStyle = this.questionEndColor;
        ctx.fillText(this.questionEndComputingAns, 125, 240);
      }

      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      ctx.roundRect(24, 264, 200, 30, 5);
      if (this.answerresult) {
        if (this.questionArray[this.qi].options[1].is_correct == '1') {
          ctx.fillStyle = "#EC6608";
        } else {
          ctx.fillStyle = "#000000";
        }
      } else {
        ctx.fillStyle = "#000";
      }
      ctx.fill();
      ctx.closePath();
      ctx.restore();
      ctx.drawImage(this.option2, 27, 268, 22, 22);
      ctx.font = "bold 12px '" + this.questionEndFont + "'";
      ctx.fillStyle = this.questionEndOptionColor;
      ctx.fillText(this.op2, 125, 285);

      if (this.answerresult) {
        if (this.questionResultOption2.length == 0) {
          ctx.font = "14px '" + this.questionEndFont + "'";
          ctx.fillStyle = this.questionEndColor;
          ctx.fillText("No Comments Found", 125, 315);
        } else {
          if (this.questionResultOption2.length >= 1) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "#000b0d";
            ctx.arc(75, 316, 2 * 10, 2 * 10, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(this.avatarOption2a, 55, 296, 38, 38);
            ctx.stroke();
            ctx.restore();
          }

          if (this.questionResultOption2.length >= 2) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = "6";
            ctx.strokeStyle = "#000b0d";
            ctx.arc(116, 316, 2 * 10, 2 * 10, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(this.avatarOption2b, 98, 296, 38, 38);
            ctx.stroke();
            ctx.restore();
          }
        }
      } else {
        ctx.font = "14px '" + this.questionEndFont + "'";
        ctx.fillStyle = this.questionEndColor;
        ctx.fillText(this.questionEndComputingAns, 125, 315);
      }

      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      ctx.roundRect(24, 339, 200, 30, 5);
      if (this.answerresult) {
        if (this.questionArray[this.qi].options[2].is_correct == '1') {
          ctx.fillStyle = "#EC6608";
        } else {
          ctx.fillStyle = "#000000";
        }
      } else {
        ctx.fillStyle = "#000";
      }
      ctx.fill();
      ctx.closePath();
      ctx.restore();
      ctx.drawImage(this.option3, 27, 343, 22, 22);
      ctx.font = "bold 12px '" + this.questionEndFont + "'";
      ctx.fillStyle = this.questionEndOptionColor;
      ctx.fillText(this.op3, 125, 358);

      if (this.answerresult) {
        if (this.questionResultOption3.length == 0) {
          ctx.font = "14px '" + this.questionEndFont + "'";
          ctx.fillStyle = this.questionEndColor;
          ctx.fillText("No Comments Found", 125, 390);
        } else {
          if (this.questionResultOption3.length >= 1) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "#000b0d";
            ctx.arc(75, 392, 2 * 10, 2 * 10, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(this.avatarOption3a, 55, 374, 38, 38);
            ctx.stroke();
            ctx.restore();
          }
          if (this.questionResultOption3.length >= 2) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = "6";
            ctx.strokeStyle = "#000b0d";
            ctx.arc(116, 392, 2 * 10, 2 * 10, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(this.avatarOption3b, 98, 374, 38, 38);
            ctx.stroke();
            ctx.restore();
          }
        }
      } else {
        ctx.font = "14px '" + this.questionEndFont + "'";
        ctx.fillStyle = this.questionEndColor;
        ctx.fillText(this.questionEndComputingAns, 125, 390);
      }

      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      ctx.roundRect(24, 415, 200, 30, 5);
      if (this.answerresult) {
        if (this.questionArray[this.qi].options[3].is_correct == '1') {
          ctx.fillStyle = "#EC6608";
        } else {
          ctx.fillStyle = "#000000";
        }
      } else {
        ctx.fillStyle = "#000";
      }
      ctx.fill();
      ctx.closePath();
      ctx.restore();
      ctx.drawImage(this.option4, 27, 420, 22, 22);
      ctx.font = "bold 12px '" + this.questionEndFont + "'";
      ctx.fillStyle = this.questionEndOptionColor;
      ctx.fillText(this.op4, 125, 435);

      if (this.answerresult) {
        if (this.questionResultOption4.length == 0) {
          ctx.font = "14px '" + this.questionEndFont + "'";
          ctx.fillStyle = this.questionEndColor;
          ctx.fillText("No Comments Found", 125, 465);
        } else {
          if (this.questionResultOption4.length >= 1) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "#000b0d";
            ctx.arc(75, 467, 2 * 10, 2 * 10, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(this.avatarOption4a, 55, 449, 38, 38);
            ctx.stroke();
            ctx.restore();
          }
          if (this.questionResultOption4.length >= 2) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = "6";
            ctx.strokeStyle = "#000b0d";
            ctx.arc(116, 467, 2 * 10, 2 * 10, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(this.avatarOption4b, 98, 449, 38, 38);
            ctx.stroke();
            ctx.restore();
          }
        }

      } else {
        ctx.font = "14px '" + this.questionEndFont + "'";
        ctx.fillStyle = this.questionEndColor;
        ctx.fillText(this.questionEndComputingAns, 125, 465);
      }
      /*
      end of question result screen
      */
    }
  }

  forthScreen() {
    if (this.canvas.getContext && this.localCameraView != null) {
      var ctx = this.canvas.getContext('2d');
      this.canvas.width = 250 * 2;
      this.canvas.height = 500 * 2;
      ctx.scale(2, 2)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(this.localCameraView, 0, 0, 250, 500);
      ctx.drawImage(this.screenbgImg4, 0, 0, 250, 500);
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = "6";
      ctx.strokeStyle = "#fff";
      ctx.arc(125, 25, 2 * 10, 2 * 10, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(this.logoImg, 106, 8, 38, 38);
      ctx.stroke();
      ctx.restore();
      this.fos1 = true;
      /*
     Start of lead winner screen
     */
      this.showSkipButton = false;
      ctx.font = "10px '" + this.gameEndFont + "'";
      ctx.fillStyle = this.gameEndColor;
      ctx.fillText(this.gameEndLeaderboard, 10, 20);
      ctx.font = "17px '" + this.gameEndFont + "'";
      ctx.fillStyle = this.gameEndColor;
      ctx.textAlign = "center";
      ctx.fillText(this.gameEndWinners, 125, 65);
      ctx.textAlign = "start";
      if (this.winner1name) {
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = 0.8;
        ctx.roundRect(45, 100, 165, 40, 5);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        ctx.drawImage(this.option1, 35, 90, 22, 22);
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = "5";
        ctx.strokeStyle = "#000b0d";
        ctx.arc(70, 120, 2 * 9, 2 * 9, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(this.winner1, 52, 104, 38, 38);
        ctx.stroke();
        ctx.restore();
        ctx.font = " bold 15px '" + this.gameEndFont + "'";
        ctx.fillStyle = "#000";
        ctx.fillText(this.winner1name[0], 90, 127);
        ctx.font = " bold 14px '" + this.gameEndFont + "'";
        ctx.fillText(this.winner1point, 187, 127);
      }
      if (this.winner2name) {
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = 0.8;
        ctx.roundRect(45, 155, 165, 40, 5);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        ctx.drawImage(this.option2, 35, 145, 22, 22);
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = "5";
        ctx.strokeStyle = "#000b0d";
        ctx.arc(70, 175, 2 * 9, 2 * 9, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(this.winner2, 52, 159, 38, 38);
        ctx.stroke();
        ctx.restore();
        ctx.font = " bold 15px '" + this.gameEndFont + "'";
        ctx.fillStyle = "#000";
        ctx.fillText(this.winner2name[0], 90, 182);
        ctx.font = " bold 14px '" + this.gameEndFont + "'";
        ctx.fillText(this.winner2point, 187, 182);
      }
      if (this.winner3name) {
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = 0.8;
        ctx.roundRect(45, 210, 165, 40, 5);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        ctx.drawImage(this.option3, 35, 200, 22, 22);
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = "5";
        ctx.strokeStyle = "#000b0d";
        ctx.arc(70, 230, 2 * 9, 2 * 9, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(this.winner3, 52, 214, 38, 38);
        ctx.stroke();
        ctx.restore();
        ctx.font = " bold 15px '" + this.gameEndFont + "'";
        ctx.fillStyle = "#000";
        ctx.fillText(this.winner3name[0], 90, 237);
        ctx.font = " bold 14px '" + this.gameEndFont + "'";
        ctx.fillText(this.winner3point, 187, 237);
      }
      if (this.winner4name) {
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = 0.8;
        ctx.roundRect(45, 265, 165, 40, 5);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        ctx.drawImage(this.option4, 35, 255, 22, 22);
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = "5";
        ctx.strokeStyle = "#000b0d";
        ctx.arc(70, 285, 2 * 9, 2 * 9, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(this.winner4, 52, 269, 38, 38);
        ctx.stroke();
        ctx.restore();
        ctx.font = " bold 15px '" + this.gameEndFont + "'";
        ctx.fillStyle = "#000";
        ctx.fillText(this.winner4name[0], 90, 292);
        ctx.font = " bold 14px '" + this.gameEndFont + "'";
        ctx.fillText(this.winner4point, 187, 292);
      }
      if (this.winner5name) {
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = 0.8;
        ctx.roundRect(45, 320, 165, 40, 5);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        ctx.drawImage(this.option5, 35, 310, 22, 22);
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = "5";
        ctx.strokeStyle = "#000b0d";
        ctx.arc(70, 340, 2 * 9, 2 * 9, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(this.winner5, 52, 324, 38, 38);
        ctx.stroke();
        ctx.restore();
        ctx.font = " bold 15px '" + this.gameEndFont + "'";
        ctx.fillStyle = "#000";
        ctx.fillText(this.winner5name[0], 90, 347);
        ctx.font = " bold 14px '" + this.gameEndFont + "'";
        ctx.fillText(this.winner5point, 187, 347);
      }
      /*
      end of lead winner screen
      */
    }
  }

  timerr(minute: any) {
    // let minute = 2;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    this.timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.winTime = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  }


  startScreenTimer() {
    let sec = 20;
    this.starttimer = setInterval(() => {
      if (!this.timerPause) {
        if (sec == 0) {
          clearTimeout(this.starttimer);
          clearInterval(this.startScreenInterval);
          this.firstScreenInterval = setInterval(() => {
            this.firstScreen();
            // this.startScreen();
          }, 1000 / 30);
          this.firstScreenTimer(this.firstScreenTimeNew);
        } else {
          const sprefix = sec < 10 ? '0' : '';
          this.startScreenTime = `${sprefix}${sec}`;
          sec--;
        }
      }
    }, 1000);
  }


  firstScreenTimer(minute: any) {
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    this.timer1 = setInterval(() => {
      if (!this.timerPause) {
        seconds--;
        if (statSec != 0) statSec--;
        else statSec = 59;

        if (statSec < 10) {
          textSec = '0' + statSec;
        } else textSec = statSec;

        this.firstScreenTime = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

        if (seconds == 0) {
          this.fs1 = false;
          clearInterval(this.timer1);
          clearInterval(this.firstScreenInterval);
          this.secondScreenInterval = setInterval(() => {
            this.secondScreen();
          }, 1000 / 30);
          this.triviaCommentInterval = setInterval(() => {
            this.storeTriviaComments();
          }, 10000);
          this.secondScreenTimer();
        }
      }
    }, 1000);
  }

  secondScreenTimer() {
    // setTimeout(() => { }, 1000);
    let sec = this.questionTime;
    this.timer2 = setInterval(() => {
      if (!this.timerPause) {
        if (sec == 0) {
          this.ss1 = false;
          clearTimeout(this.timer2);
          clearInterval(this.secondScreenInterval);
          this.thirdScreenInterval = setInterval(() => {
            this.thirdScreen();
          }, 1000 / 30);
          this.thirdScreenTimer();
          setTimeout(() => {
            clearInterval(this.triviaCommentInterval);
          }, 10000);
          setTimeout(() => {
            this.getQuestionsComments();
            this.showSkipButton = true;
          }, 15000);
        } else {
          const sprefix = sec < 10 ? '0' : '';
          this.secondScreenTime = `${sprefix}${sec}`;
          sec--;
        }
      }
    }, 1000);
  }

  thirdScreenTimer() {
    // setTimeout(() => { }, 1000);
    let sec = this.questionEndTime;
    this.timer3 = setInterval(() => {
      if (!this.timerPause) {
        if (sec == 0 && this.qi == (this.questionArrayLength - 1)) {
          this.ts1 = false;
          clearInterval(this.thirdScreenInterval);
          this.getTriviaLeaderboard();
          this.forthScreenInterval = setInterval(() => {
            this.forthScreen();
          }, 1000 / 30);
        } else if (sec == 0) {
          this.qi = this.qi + 1;
          this.ts1 = false;
          clearInterval(this.timer3);
          clearInterval(this.thirdScreenInterval);
          this.secondScreenInterval = setInterval(() => {
            this.secondScreen();
          }, 1000 / 30);
          this.triviaCommentInterval = setInterval(() => {
            this.storeTriviaComments();
          }, 10000);
          this.secondScreenTimer();
        } else if (this.skipQuestion && sec != 0) {
          this.qi = this.qi + 1;
          this.ts1 = false;
          clearInterval(this.timer3);
          clearInterval(this.thirdScreenInterval);
          this.secondScreenInterval = setInterval(() => {
            this.secondScreen();
          }, 1000 / 30);
          this.triviaCommentInterval = setInterval(() => {
            this.storeTriviaComments();
          }, 10000);
          this.secondScreenTimer();
        } else {
          const sprefix = sec < 10 ? '0' : '';
          this.thirdScreenTime = `${sprefix}${sec}`;
          sec--;
        }
      }
    }, 1000);
  }

  pauseGame() {
    this.timerPause = true;
  }

  resumeGame() {
    this.timerPause = false;
  }


  showWinnerScreen() {
    if (this.fs1) {
      clearInterval(this.firstScreenInterval);
    }
    if (this.ss1) {
      clearInterval(this.secondScreenInterval);
    }
    if (this.ts1) {
      clearInterval(this.thirdScreenInterval);
    }
    // this.fs1 = false;
    this.timerPause = true;
    this.getTriviaLeaderboard();
    this.winnerScreenInterval = setInterval(() => {
      this.forthScreen();
    }, 1000 / 30);
  }

  hideWinnerScreen() {
    this.timerPause = false;
    clearInterval(this.winnerScreenInterval);
    if (this.fs1) {
      this.firstScreenInterval = setInterval(() => {
        this.firstScreen();
      }, 1000 / 30);
    }
    if (this.ss1) {
      this.secondScreenInterval = setInterval(() => {
        this.secondScreen();
      }, 1000 / 30);
    }
    if (this.ts1) {
      this.thirdScreenInterval = setInterval(() => {
        this.thirdScreen();
      }, 1000 / 30);
    }
  }

  skipNextQuestion() {
    this.skipQuestion = true;
  }

  gameEnd() {
    this.fos1 = false;
    clearInterval(this.timer3);
    clearInterval(this.thirdScreenInterval);
    this.getTriviaLeaderboard();
    this.forthScreenInterval = setInterval(() => {
      this.forthScreen();
    }, 1000 / 30);
  }

  getTriviaLeaderboard() {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('streamId', this.streamId)
    this.commonservice.getTriviaLeaderboard(formData).subscribe((result: any) => {
      if (result["status"] == 1) {
        this.leaderboardArray = result["result"];
        if (this.leaderboardArray.length >= 1) {
          this.winner1.src = this.leaderboardArray[0].profile;
          this.winner1name = this.leaderboardArray[0].facebookName.split(' ');
          // this.winner1name = this.winner1name[0].split('_');
          this.winner1point = this.leaderboardArray[0].point;
        }
        if (this.leaderboardArray.length >= 2) {
          this.winner2.src = this.leaderboardArray[1].profile;
          this.winner2name = this.leaderboardArray[1].facebookName.split(' ');
          // this.winner2name = this.winner2name[0].split('_');
          this.winner2point = this.leaderboardArray[1].point;
        }
        if (this.leaderboardArray.length >= 3) {
          this.winner3.src = this.leaderboardArray[2].profile;
          this.winner3name = this.leaderboardArray[2].facebookName.split(' ');
          // this.winner3name = this.winner3name[0].split('_');
          this.winner3point = this.leaderboardArray[2].point;
        }
        if (this.leaderboardArray.length >= 4) {
          this.winner4.src = this.leaderboardArray[3].profile;
          this.winner4name = this.leaderboardArray[3].facebookName.split(' ');
          // this.winner4name = this.winner4name[0].split('_');
          this.winner4point = this.leaderboardArray[3].point;
        }
        if (this.leaderboardArray.length >= 5) {
          this.winner5.src = this.leaderboardArray[4].profile;
          this.winner5name = this.leaderboardArray[4].facebookName.split(' ');
          // this.winner5name = this.winner5name[0].split('_');
          this.winner5point = this.leaderboardArray[4].point;
        }

      } else if (result["status"] == 0) {
        // this.message = result["message"];
        // this.toastr.showError(this.message, "Sorry!");
      }
    },
      (error: HttpErrorResponse) => {
        // this.toastr.showInfo(error.error.message, "Information!");
      })
  }

  triviaGameSave() {
    // console.log(this.triviaQuestionForm.value);
    this.gameTitle = this.triviaQuestionForm.value.gameS1Title;
    this.gameTitlePadding = this.triviaQuestionForm.value.gameS1TitlePadding;
    this.gameSubtitle = this.triviaQuestionForm.value.gameS1Subtitle;
    this.gameSubtitlePadding = this.triviaQuestionForm.value.gameS1SubtitlePadding;
    this.gameFont = this.triviaQuestionForm.value.gameS1Font;
    this.firstScreenTimeNew = this.triviaQuestionForm.value.gameS1Timer;
    this.gameColor = this.triviaQuestionForm.value.gameS1Color;

    if (this.triviaQuestionForm.value.gameS1Timer == "1") {
      this.firstScreenTime = "01:00";
    } else if (this.triviaQuestionForm.value.gameS1Timer == "2") {
      this.firstScreenTime = "02:00";
    } else if (this.triviaQuestionForm.value.gameS1Timer == "3") {
      this.firstScreenTime = "03:00";
    } else if (this.triviaQuestionForm.value.gameS1Timer == "4") {
      this.firstScreenTime = "04:00";
    } else if (this.triviaQuestionForm.value.gameS1Timer == "5") {
      this.firstScreenTime = "05:00";
    }

    if (this.triviaQuestionForm.value.gameS1BgImg == "1") {
      this.screenbgImg1.src = "./assets/images/bg1.jpg";
    } else if (this.triviaQuestionForm.value.gameS1BgImg == "2") {
      this.screenbgImg1.src = "./assets/images/bgimg2.jpg";
    } else if (this.triviaQuestionForm.value.gameS1BgImg == "3") {
      this.screenbgImg1.src = "./assets/images/bgimg3.jpg";
    } else if (this.triviaQuestionForm.value.gameS1BgImg == "4") {
      this.screenbgImg1.src = "./assets/images/bgimg4.jpg";
    } else if (this.triviaQuestionForm.value.gameS1BgImg == "5") {
      this.screenbgImg1.src = "./assets/images/bgimg1.jpg";
    }

    this.questionQuest = this.triviaQuestionForm.value.gameS2Question;
    this.questionGameExp = this.triviaQuestionForm.value.gameS2GameExp;
    this.questionFont = this.triviaQuestionForm.value.gameS2Font;
    this.questionColor = this.triviaQuestionForm.value.gameS2Color;
    this.questionTime = this.triviaQuestionForm.value.gameS2Timer;

    if (this.triviaQuestionForm.value.gameS2BgImg == "1") {
      this.screenbgImg2.src = "./assets/images/bgimg1.jpg";
    } else if (this.triviaQuestionForm.value.gameS2BgImg == "2") {
      this.screenbgImg2.src = "./assets/images/bgimg2.jpg";
    } else if (this.triviaQuestionForm.value.gameS2BgImg == "3") {
      this.screenbgImg2.src = "./assets/images/bgimg3.jpg";
    } else if (this.triviaQuestionForm.value.gameS2BgImg == "4") {
      this.screenbgImg2.src = "./assets/images/bgimg4.jpg";
    } else if (this.triviaQuestionForm.value.gameS2BgImg == "5") {
      this.screenbgImg2.src = "./assets/images/bg1.jpg";
    }

    this.questionEndResultOfQuest = this.triviaQuestionForm.value.gameS3ResultOfQuest;
    // this.questionEndOthers = this.triviaQuestionForm.value.gameS3Others;
    this.questionEndNextQuest = this.triviaQuestionForm.value.gameS3NextQuest;
    this.questionEndComputingAns = this.triviaQuestionForm.value.gameS3ComputingAns;
    this.questionEndFont = this.triviaQuestionForm.value.gameS3Font;
    this.questionEndColor = this.triviaQuestionForm.value.gameS3Color;
    this.questionEndOptionColor = this.triviaQuestionForm.value.gameS3OptionColor;
    this.questionEndTime = this.triviaQuestionForm.value.gameS3Timer;
    if (this.triviaQuestionForm.value.gameS3BgImg == "1") {
      this.screenbgImg3.src = "./assets/images/bg1.jpg";
    } else if (this.triviaQuestionForm.value.gameS3BgImg == "2") {
      this.screenbgImg3.src = "./assets/images/bgimg2.jpg";
    } else if (this.triviaQuestionForm.value.gameS3BgImg == "3") {
      this.screenbgImg3.src = "./assets/images/bgimg3.jpg";
    } else if (this.triviaQuestionForm.value.gameS3BgImg == "4") {
      this.screenbgImg3.src = "./assets/images/bgimg4.jpg";
    } else if (this.triviaQuestionForm.value.gameS3BgImg == "5") {
      this.screenbgImg3.src = "./assets/images/bgimg1.jpg";
    }
    // if (this.triviaQuestionForm.value.gameS3Timer == "1") {
    //   this.thirdScreenTime = "30";
    // } else if (this.triviaQuestionForm.value.gameS3Timer == "2") {
    //   this.thirdScreenTime = "35";
    // } else if (this.triviaQuestionForm.value.gameS3Timer == "3") {
    //   this.thirdScreenTime = "40";
    // } else if (this.triviaQuestionForm.value.gameS3Timer == "4") {
    //   this.thirdScreenTime = "45";
    // } else if (this.triviaQuestionForm.value.gameS3Timer == "5") {
    //   this.thirdScreenTime = "50";
    // }

    this.gameEndLeaderboard = this.triviaQuestionForm.value.gameS4Leaderboard;
    this.gameEndWinners = this.triviaQuestionForm.value.gameS4Winners;
    this.gameEndFont = this.triviaQuestionForm.value.gameS4Font;
    this.gameEndColor = this.triviaQuestionForm.value.gameS4Color;

    if (this.triviaQuestionForm.value.gameS4BgImg == "1") {
      this.screenbgImg4.src = "./assets/images/bg1.jpg";
    } else if (this.triviaQuestionForm.value.gameS4BgImg == "2") {
      this.screenbgImg4.src = "./assets/images/bgimg2.jpg";
    } else if (this.triviaQuestionForm.value.gameS4BgImg == "3") {
      this.screenbgImg4.src = "./assets/images/bgimg3.jpg";
    } else if (this.triviaQuestionForm.value.gameS4BgImg == "4") {
      this.screenbgImg4.src = "./assets/images/bgimg4.jpg";
    } else if (this.triviaQuestionForm.value.gameS4BgImg == "5") {
      this.screenbgImg4.src = "./assets/images/bgimg1.jpg";
    }
  }

  updateTriviaGame() {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('triviaId', this.triviaId)
    formData.append('gameTitle', this.triviaQuestionForm.value.gameS1Title)
    formData.append('gameTitlePadding', this.triviaQuestionForm.value.gameS1TitlePadding)
    formData.append('gameSubtitle', this.triviaQuestionForm.value.gameS1Subtitle)
    formData.append('gameSubtitlePadding', this.triviaQuestionForm.value.gameS1SubtitlePadding)
    formData.append('gameFont', this.triviaQuestionForm.value.gameS1Font)
    formData.append('firstScreenTime', this.triviaQuestionForm.value.gameS1Timer)
    formData.append('gameColor', this.triviaQuestionForm.value.gameS1Color)
    formData.append('questionColor', this.triviaQuestionForm.value.gameS2Color)
    formData.append('questionFont', this.triviaQuestionForm.value.gameS2Font)
    formData.append('questionTime', this.triviaQuestionForm.value.gameS2Timer)
    formData.append('questionGameExp', this.triviaQuestionForm.value.gameS2GameExp)
    formData.append('questionQuest', this.triviaQuestionForm.value.gameS2Question)
    formData.append('questionEndOptionColor', this.triviaQuestionForm.value.gameS3OptionColor)
    formData.append('questionEndColor', this.triviaQuestionForm.value.gameS3Color)
    formData.append('questionEndFont', this.triviaQuestionForm.value.gameS3Font)
    formData.append('questionEndTime', this.triviaQuestionForm.value.gameS3Timer)
    formData.append('questionEndComputingAns', this.triviaQuestionForm.value.gameS3ComputingAns)
    formData.append('questionEndNextQuest', this.triviaQuestionForm.value.gameS3NextQuest)
    formData.append('questionEndOthers', "Others")
    formData.append('questionEndResultOfQuest', this.triviaQuestionForm.value.gameS3ResultOfQuest)
    formData.append('gameEndColor', this.triviaQuestionForm.value.gameS4Color)
    formData.append('gameEndFont', this.triviaQuestionForm.value.gameS4Font)
    formData.append('gameEndWinners', this.triviaQuestionForm.value.gameS4Winners)
    formData.append('gameEndLeaderboard', this.triviaQuestionForm.value.gameS4Leaderboard)

    this.spinnerService.show();
    this.commonservice.saveTriviaGame(formData).subscribe((result: any) => {
      this.spinnerService.hide();
      if (result["status"] == 1) {
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

  deleteTriviaQuestion(questionId: any) {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('triviaId', this.triviaId)
    formData.append('questionId', questionId)
    this.spinnerService.show();
    this.commonservice.deleteTriviaQuestion(formData).subscribe((result: any) => {
      this.spinnerService.hide();
      if (result["status"] == 1) {
        this.questionId = result["result"].questionId;
        this.getQuestions();
        this.message = result["message"];
        this.toastr.showSuccess(this.message, "Success!");
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

  deleteAllTriviaQuestion() {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('triviaId', this.triviaId)
    formData.append('deleteAll', "yes")
    this.spinnerService.show();
    this.commonservice.deleteTriviaQuestion(formData).subscribe((result: any) => {
      this.spinnerService.hide();
      if (result["status"] == 1) {
        this.questionId = result["result"].questionId;
        this.questionArray = [];
        this.questionArrayLength = 0;
        this.message = result["message"];
        this.toastr.showSuccess(this.message, "Success!");
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

  generateTriviaQuestions() {
    // if (this.generatetriviaQuestionForm.value.questionNumber != 0 && (this.generatetriviaQuestionForm.value.questionNumber <= 10)) {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('triviaId', this.triviaId)
    formData.append('questionNumber', this.generatetriviaQuestionForm.value.questionNumber)
    this.spinnerService.show();
    this.commonservice.generateTriviaQuestions(formData).subscribe((result: any) => {
      this.spinnerService.hide();
      if (result["status"] == 1) {
        this.questionId = result["result"].questionId;
        this.getQuestions();
        this.message = result["message"];
        this.toastr.showSuccess(this.message, "Success!");
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
    // } else if(this.questionId.split(',').length >= 10) {
    //   this.toastr.showError("You can not generate more than 10 Questions", "Error!");
    // } else {
    //   this.toastr.showInfo("Please Choose Between 1-10", "Information!");
    // }
  }

  addNewTriviaQuestion() {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('triviaId', this.triviaId)
    formData.append('question', this.addTriviaQuestionForm.value.question)
    formData.append('option1', this.addTriviaQuestionForm.value.option1)
    formData.append('option2', this.addTriviaQuestionForm.value.option2)
    formData.append('option3', this.addTriviaQuestionForm.value.option3)
    formData.append('option4', this.addTriviaQuestionForm.value.option4)
    this.spinnerService.show();
    this.commonservice.addTriviaQuestions(formData).subscribe((result: any) => {
      this.spinnerService.hide();
      if (result["status"] == 1) {
        this.questionId = result["result"].questionId;
        this.getQuestions();
        this.message = result["message"];
        this.toastr.showSuccess(this.message, "Success!");
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

  wrapText(ctx: any, text: any, x: any, y: any, maxWidth: any, lineHeight: any) {
    // First, start by splitting all of our text into words, but splitting it into an array split by spaces
    let words = text.split(' ');
    let line = ''; // This will store the text of the current line
    let testLine = ''; // This will store the text when we add a word, to test if it's too long
    let lineArray = []; // This is an array of lines, which the function will return

    // Lets iterate over each word
    for (var n = 0; n < words.length; n++) {
      // Create a test line, and measure it..
      testLine += `${words[n]} `;
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      // If the width of this test line is more than the max width
      if (testWidth > maxWidth && n > 0) {
        // Then the line is finished, push the current line into "lineArray"
        lineArray.push([line, x, y]);
        // Increase the line height, so a new line is started
        y += lineHeight;
        // Update line and test line to use this word as the first word on the next line
        line = `${words[n]} `;
        testLine = `${words[n]} `;
      }
      else {
        // If the test line is still less than the max width, then add the word to the current line
        line += `${words[n]} `;
      }
      // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
      if (n === words.length - 1) {
        lineArray.push([line, x, y]);
      }
    }
    // Return the line array
    return lineArray;
  }


}

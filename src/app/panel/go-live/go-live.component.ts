import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';

import { WebRTCAdaptor } from '@antmedia/webrtc_adaptor';
import { CommentService } from '../../comment.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrserviceService } from '../../services/notification/toastrservice.service';
import { NgxSpinnerService } from "ngx-spinner";
import { SocialsService } from '../../services/stream/socials.service';

@Component({
  selector: 'app-go-live',
  templateUrl: './go-live.component.html',
  styleUrls: ['./go-live.component.css']
})
export class GoLiveComponent implements OnInit {

  //webrtc
  webrtcAdaptor: any;
  token: any;
  pc_config: any = null;
  sdpConstraintsPublish: any;
  mediaConstraintsPublish: any;
  websocketURL!: string;
  streamId: any;
  infodata: string = '';
  messagedata: any;
  @ViewChild('div') div!: ElementRef;
  isSend: boolean = false;
  endComments: boolean = false;
  textComment!: FormGroup;
  productForm!: FormGroup;
  commentsArr: any = [{ "id": 0, "comment": "" }, { "id": 1, "comment": "" }, { "id": 2, "comment": "" }];
  commentsArr2: any = [];
  canvas: any;
  vid: any;
  video: any;
  image: any;
  image1: any;
  image2: any;
  image3: any;
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
  intervalId: any;
  intervalId2: any;
  fbComments: any;
  winTime: string = "02:00";
  firstcomment: string = "waiting";
  secondcomment: string = "";
  thirdcomment: string = "";
  firstcommentName: string = "#1";
  secondcommentName: string = "";
  thirdcommentName: string = "";
  avatar1: any = new Image();
  avatar2: any = new Image();
  avatar3: any = new Image();
  avatardummy: any = new Image();
  winner2: any = new Image();
  winner3: any = new Image();
  winner1: any = new Image();
  logoImg: any = new Image();
  timer: any;
  streamUrl: any = "";
  after: any = "";
  lastid: any;
  message: any;
  showTitle: boolean = false;
  showSubtitle: boolean = false;
  showPrizeImage: boolean = false;
  showWinTimer: boolean = false;
  ptitle: string = "Be lucky today and win";
  ptitleS: string = "22";
  ptitleC: string = "#FBF6F6";
  ptitleF: string = "29LT Bukra";
  pName: string = "iPhone XR red";
  pNameS: string = "42";
  pNameC: string = "#EE1C24";
  pNameF: string = "29LT Bukra";
  ptime: string = "2";
  pTimeS: string = "42";
  pTimeC: string = "#EE1C24";
  pTimeF: string = "29LT Bukra";

  socialChannelData: string = "";
  socialChannelArray: any = [];
  userSocialStatus: any;
  facebookConnected: boolean = false;
  instagramConnected: boolean = false;

  startScreenTime: any = 20;
  starttimer: any;
  
  constructor(private renderer: Renderer2, private social: SocialsService, private commentservice: CommentService, public datepipe: DatePipe, private router: Router, public sanitizer: DomSanitizer, private spinnerService: NgxSpinnerService, private toastr: ToastrserviceService) {
    if (!(localStorage.getItem("isLoggedIn"))) {
      this.toastr.showError("Please Login Again", "Session Expire!");
      this.router.navigate(['/']);
    }
    this.avatar1.src = "./assets/images/avatar1.png";
    this.avatar2.src = "./assets/images/avatar2.png";
    this.avatar3.src = "./assets/images/avatar3.png";
    this.avatardummy.src = "./assets/images/avatar4.png";
    this.winner2.src = "./assets/images/2-32.png";
    this.winner3.src = "./assets/images/3-32.png";
    this.winner1.src = "./assets/images/winner.png";
    this.logoImg.src = "./assets/images/logo.png";
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
        width: { ideal: 840 }, height: { ideal: 555 },
        aspectRatio: 1.5,
      },
      audio: true
    };
    this.textComment = new FormGroup({
      text: new FormControl('')
    });

    this.productForm = new FormGroup({
      productTitle: new FormControl('Be lucky today and win'),
      productTitleSize: new FormControl(this.ptitleS),
      productTitleColor: new FormControl('#FBF6F6'),
      productTitleFont: new FormControl('29LT Bukra'),
      productName: new FormControl('iPhone XR red'),
      productSubtitleSize: new FormControl('45'),
      productSubtitleColor: new FormControl('#EE1C24'),
      productSubtitleFont: new FormControl('29LT Bukra'),
      productImg: new FormControl(''),
      productTime: new FormControl('2'),
      productTimeSize: new FormControl('50'),
      productTimeColor: new FormControl('#EE1C24'),
      productTimeFont: new FormControl('29LT Bukra'),
    });

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
          // if (!(this.socialChannelData == undefined)) {
          // this.PublishStreaming(this.streamId);
          // }
        } else if (info == "pong") {
        } else if (info == "publish_started") {
          this.startScreenInterval = setInterval(() => {
            clearInterval(this.defaultInterval);
            this.startScreen();
          }, 1000 / 30);
          this.startScreenTimer();
          this.intervalId = setInterval(() => {
            this.storeLastComments();
            this.allComments();
          }, 500);
          // this.intervalId2 = setInterval(() => {
          //   this.addComments();
          // }, 1000);

          // console.log("publish started");
        } else if (info == "publish_finished") {
          clearInterval(this.intervalId);
          // console.log("publish finished");
        } else if (info == "data_received") {
          console.log(description);
          this.messagedata = description.data;
          const p: HTMLParagraphElement = this.renderer.createElement('p');
          p.innerHTML = description.data
          this.renderer.appendChild(this.div.nativeElement, p)
          console.log(description.data);
        } else if (info == "available_devices") {
        } else if (info == "closed") {
          if (typeof description != "undefined") {
            this.webrtcAdaptor = null;
            this.initWebrtc('');
          }
        }
      },
      callbackError: (error: any, message: any) => {
        this.toastr.showError("Please Login Again", "Session Expire!");
        this.router.navigate(['/']);
        // console.log("error callback: " + JSON.stringify(error));
        var errorMessage = JSON.stringify(error);
        if (typeof message != "undefined") {
          errorMessage = message;
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
          errorMessage = "There is no device found that fits your video and audio constraints. You may change video and audio constraints"
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
        }
      }
    });
  }

  ngOnInit(): void {
    this.userInfo = localStorage.getItem("userData");
    this.userInfo = JSON.parse(this.userInfo);

    this.getSocialEndpoint();
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
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('streamName', "Testing")
    formData.append('socialChannel', data)
    formData.append('type', "web")
    this.spinnerService.show();
    this.commentservice.createBroadcast(formData).subscribe((result: any) => {
      // console.log(result);
      this.spinnerService.hide();
      if (result["status"] == 1) {
        this.message = result["message"];
        this.streamId = result["streamId"];
        this.streamUrl = "https://developer.easestream.com/LiveApp/play.html?name=" + this.streamId;
        this.streamUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.streamUrl);
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
          this.router.navigate(['/']);
        } else {
          this.toastr.showError("Please Login Again", "Session Expire!");
          this.router.navigate(['/']);
        }
      }
    },
      (error: HttpErrorResponse) => {
        this.toastr.showInfo(error.error.message, "Information!");
      })
  }

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('canvas');
    this.vid = document.getElementById('localVideo');
    this.image = new Image();
    this.image1 = new Image();
    this.image2 = new Image();
    this.image3 = new Image();


    this.inputbox = new Image();
    this.image.src = "./assets/images/logo.jpg";
    this.image1.src = "./assets/images/product1.png";
    this.image2.src = "./assets/images/bg.jpg";
    this.image3.src = "./assets/images/bg.png";

    this.inputbox.input = "";
    this.localCameraView = null;
    this.defaultInterval = setInterval(() => {
      this.draw();
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
    this.commentsArr = [];
    this.commentsArr = [{ "id": 0, "comment": "" }, { "id": 1, "comment": "" }, { "id": 2, "comment": "" }];
    clearInterval(this.intervalId);
    // clearInterval(this.intervalId2);
  }

  stopStreaming() {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('streamId', this.streamId)
    formData.append('type', "web")
    this.commentservice.stopBroadcast(formData).subscribe((result: any) => {
      if (result["status"] == 1) {
        // this.message = result["message"];
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

  allComments() {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('streamId', this.streamId)
    this.commentservice.allComments(formData).subscribe((result: any) => {
      if (result["status"] == 1) {
        if (result["result"].length >= 1) {
          this.firstcomment = result["result"][0]!.userComment;
          this.firstcommentName = result["result"][0]!.username;
          this.avatar1.src = result["result"][0]!.userProfile;
        }
        if (this.lastid != result["result"][0]!.id) {
          this.lastid = result["result"][0]!.id;
          clearInterval(this.timer);
          this.timerr(this.ptime);
        }
        if (result["result"].length >= 2) {
          this.secondcomment = result["result"][1]!.userComment;
          this.secondcommentName = result["result"][1]!.username;
          this.avatar2.src = result["result"][1]!.userProfile;
        }
        if (result["result"].length >= 3) {
          this.thirdcomment = result["result"][2]!.userComment;
          this.thirdcommentName = result["result"][2]!.username;
          this.avatar3.src = result["result"][2]!.userProfile;
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

  storeLastComments() {
    const formData = new FormData();
    formData.append('userId', this.userInfo['id'])
    formData.append('streamId', this.streamId)
    formData.append('type', "web")
    formData.append('fbAccessToken', this.fbAccessToken)
    formData.append('broadcastId', this.fbBroadcastId)
    formData.append('after', this.after)
    formData.append('bid', this.instagrambId)
    formData.append('instagramtoken', this.instagramtoken)
    this.commentservice.storeLastComments(formData).subscribe((result: any) => {
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


  clearData() {
    this.commentservice.deleteAllComments().subscribe((result: any) => {
      this.commentsArr = [];
      this.commentsArr = [{ "id": 0, "comment": "" }, { "id": 1, "comment": "" }, { "id": 2, "comment": "" }];
    },
      (error: HttpErrorResponse) => {
        console.log(error);
      })
  }

  getComments() {
    this.commentsArr.push({ "id": this.commentsArr.length, "comment": this.textComment.value.text });
    this.commentsArr.forEach((element: any) => {
      if (element.id == (this.commentsArr.length - 1) || element.id == (this.commentsArr.length - 2) || element.id == (this.commentsArr.length - 3)) {
        this.sendInstruction(element.comment, element.id);
      }
    });
  }

  sendInstruction(comment: any, index: any) {
    // console.log("index"+index);    
    let data = {
      "id": index,
      "text": comment,
      "start": "now",
      "duration": 20,
      "position": { "x": 280, "y": (185 + (index * 30)) },
      "style": {
        "font": "Work Sans",
        "size": 20,
        "style": "bold",
        "color": "#fff"
      },
      "shadow": {
        "radius": 3
      }
    }
    this.commentservice.sendInstruction(data).subscribe((result: any) => {
    },
      (error: HttpErrorResponse) => {
        console.log(error);
      })
  }

  startScreen() {
    if (this.canvas.getContext && this.localCameraView != null) {
      var ctx = this.canvas.getContext('2d');
      this.canvas.width = 640 + 200;
      this.canvas.height = 480 + 75;
      ctx.drawImage(this.localCameraView, 0, 0, this.canvas.width, this.canvas.height);
      ctx.drawImage(this.image2, 0, 0, this.canvas.width, this.canvas.height);
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = "6";
      ctx.strokeStyle = "#fff";
      ctx.arc(420, 25, 2 * 10, 2 * 10, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(this.logoImg, 401, 6, 38, 38);
      ctx.stroke();
      ctx.restore();
      ctx.font = "bold 23px '" + this.ptitleF + "'";
      ctx.textAlign = "center";
      ctx.fillStyle = this.ptitleC;
      ctx.fillText("GAME PREPARING...", 425, 277);
      ctx.font = "42px '" + this.ptitleF + "'";
      ctx.fillStyle = this.ptitleC;
      ctx.fillText(this.startScreenTime, 425, 337);
    }
  }

  draw() {
    if (this.canvas.getContext && this.localCameraView != null) {
      var ctx = this.canvas.getContext('2d');
      this.canvas.width = 640 + 200;
      this.canvas.height = 480 + 75;
      ctx.drawImage(this.localCameraView, 0, 0, this.canvas.width, this.canvas.height);
      ctx.drawImage(this.image2, 0, 0, this.canvas.width, this.canvas.height);
      ctx.drawImage(this.image3, 0, 55, 360, 530);
      ctx.drawImage(this.image1, 25, 35, 250, 400);
      ctx.font = this.ptitleS + "px '" + this.ptitleF + "'";
      ctx.fillStyle = this.ptitleC;
      ctx.fillText(this.ptitle, 20, 465);
      // let titleText = this.wrapText(ctx, this.ptitle, 20, 465, 345, 30);
      // titleText.forEach( (item:any) => {
      //   ctx.fillText(item[0], item[1], item[2]);
      // })
      ctx.font = this.pNameS + "px '" + this.ptitleF + "'";
      ctx.fillStyle = this.pNameC;
      ctx.fillText(this.pName, 20, 520);
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = "6";
      ctx.strokeStyle = "#fff";
      ctx.arc(420, 25, 2 * 10, 2 * 10, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(this.logoImg, 401, 6, 38, 38);
      ctx.stroke();
      ctx.restore();
      if (this.secondcomment) {
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = 0.7;
        ctx.roundRect(365, 75, 110, 160, 45);
        ctx.fillStyle = "#000b0d";
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = "7";
        ctx.strokeStyle = "#000b0d";
        ctx.arc(420, 100, 2 * 25, 2 * 25, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(this.avatar2, 370, 48, 100, 100);
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.7;
      ctx.roundRect(515, 140, 130, 180, 55);
      ctx.fillStyle = "#000b0d";
      ctx.fill();
      ctx.closePath();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = "7";
      ctx.strokeStyle = "#000b0d";
      ctx.arc(580, 170, 2 * 30, 2 * 30, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(this.avatar1, 520, 107, 120, 120);
      ctx.stroke();
      ctx.restore();

      if (this.thirdcomment) {
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = 0.7;
        ctx.roundRect(685, 75, 110, 160, 45);
        ctx.fillStyle = "#000b0d";
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = "7";
        ctx.strokeStyle = "#000b0d";
        ctx.arc(740, 100, 2 * 25, 2 * 25, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(this.avatar3, 690, 48, 100, 100);
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      ctx.roundRect(365, 440, 460, 100, 50);
      ctx.fillStyle = "#000b0d";
      ctx.fill();
      ctx.closePath();
      ctx.restore();
      ctx.font = "bold 17px '" + this.pTimeF + "'";
      ctx.fillStyle = "#FBF6F6";
      ctx.fillText("A comment that stays", 395, 480);
      // let wrappedText = this.wrapText(ctx, "This line is way too long. It's going to overflow - but it should line break.", 85, 200, 150, 20);
      // wrappedText.forEach( (item:any) => {
      //   ctx.fillText(item[0], item[1], item[2]);
      // })
      ctx.fillText("last for", 395, 510);
      ctx.font = "bold 17px '" + this.pTimeF + "'";
      ctx.fillStyle = "#EE1C24";
      ctx.fillText("  " + this.ptime + " minutes win!", 462, 510);
      ctx.save();
      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      ctx.roundRect(640, 450, 175, 80, 50);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
      ctx.restore();
      ctx.font = "bold " + this.pTimeS + "px '" + this.pTimeF + "'";
      ctx.fillStyle = this.pTimeC;
      ctx.fillText(this.winTime, 660, 505);
      ctx.save();
      ctx.restore();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 15px '" + this.pTimeF + "'";
      ctx.textAlign = "center";
      if (this.endComments) {
        if (this.secondcomment) {
          ctx.drawImage(this.winner2, 405, 130, 32, 30);
        }
        if (this.thirdcomment) {
          ctx.drawImage(this.winner3, 725, 130, 32, 30);
        }
        ctx.drawImage(this.winner1, 520, 210, 120, 30);
        ctx.fillText(this.secondcommentName, 420, 180);
        ctx.fillText(this.firstcommentName, 580, 265);
        ctx.fillText(this.thirdcommentName, 740, 180);
        ctx.save();
        ctx.restore();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 13px '" + this.pTimeF + "'";
        ctx.textAlign = "center";
        ctx.fillText(this.secondcomment, 420, 205);
        ctx.fillText(this.firstcomment, 580, 290);
        ctx.fillText(this.thirdcomment, 740, 205);
      } else {
        ctx.fillText(this.secondcommentName, 420, 170);
        ctx.fillText(this.firstcommentName, 580, 250);
        ctx.fillText(this.thirdcommentName, 740, 170);
        ctx.save();
        ctx.restore();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 13px '" + this.pTimeF + "'";
        ctx.textAlign = "center";
        ctx.fillText(this.secondcomment, 420, 195);
        ctx.fillText(this.firstcomment, 580, 275);
        ctx.fillText(this.thirdcomment, 740, 195);
      }
    }
  }

  addComments() {
    this.firstcomment = this.commentsArr2[this.commentsArr2.length - 1]!.comment;
    this.firstcommentName = this.commentsArr2[this.commentsArr2.length - 1]!.name[0];
    if (this.avatar1.src != this.commentsArr2[this.commentsArr2.length - 1]!.profilePic) {
      this.toDataURL(this.commentsArr2[this.commentsArr2.length - 1]!.profilePic, (dataUrl1: any) => {
        this.avatar1.src = dataUrl1;
      })
    }
    if (this.lastid != this.commentsArr2[this.commentsArr2.length - 1]!.fbid) {
      this.lastid = this.commentsArr2[this.commentsArr2.length - 1]!.fbid;
      clearInterval(this.timer);
      this.timerr(this.ptime);
    }
    this.secondcomment = this.commentsArr2[this.commentsArr2.length - 2]!.comment;
    this.secondcommentName = this.commentsArr2[this.commentsArr2.length - 2]!.name[0];
    if (this.avatar2.src != this.commentsArr2[this.commentsArr2.length - 2]!.profilePic) {
      this.toDataURL(this.commentsArr2[this.commentsArr2.length - 2]!.profilePic, (dataUrl2: any) => {
        this.avatar2.src = dataUrl2;
      })
    }
    this.thirdcomment = this.commentsArr2[this.commentsArr2.length - 3]!.comment;
    this.thirdcommentName = this.commentsArr2[this.commentsArr2.length - 3]!.name[0];
    if (this.avatar3.src != this.commentsArr2[this.commentsArr2.length - 3]!.profilePic) {
      this.toDataURL(this.commentsArr2[this.commentsArr2.length - 3]!.profilePic, (dataUrl3: any) => {
        this.avatar3.src = dataUrl3;
      })
    }

  }

  
  startScreenTimer() {
    let sec = 20;
    this.starttimer = setInterval(() => {
      if (sec == 0) {
        clearTimeout(this.starttimer);
        clearInterval(this.startScreenInterval);
        setInterval(() => {
          this.draw();
        }, 1000 / 30);
      } else {
        const sprefix = sec < 10 ? '0' : '';
        this.startScreenTime = `${sprefix}${sec}`;
        sec--;
      }
    }, 1000);
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
        clearInterval(this.intervalId);
        // clearInterval(this.intervalId2);
        setTimeout(() => {
          this.endComments = true;
          // this.StopPublishing();
        }, 5000);
      }
    }, 1000);
  }

  imgProductFile: any;
  productImage: any;

  onProfilePicChange(e: any) {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      const [productFile] = e.target.files;
      // console.log(productFile);
      reader.readAsDataURL(productFile);
      reader.onload = () => {
        this.imgProductFile = reader.result as string;
        this.productImage = productFile;
      };
    }
  }

  updateProductData() {
    const formData = new FormData();
    formData.append('userId', this.userInfo.id)
    formData.append('profile_pic', this.productImage)
    // this.spinnerService.show();
    // this.commentservice.updateProductData(formData).subscribe((result: any) => {
    //   // this.spinnerService.hide();
    //   if (result["status"] == 1) {
    //     // this.message = result["message"];
    //     // this.toastr.showSuccess(this.message, "Success!");
    //   } else if (result["status"] == 0) {
    //     // this.message = result["message"];
    //     // this.toastr.showError(this.message, "Sorry!");
    //   }
    // },
    //   (error: HttpErrorResponse) => {
    //     // this.toastr.showInfo(error.error.message, "Information!");
    //   })
  }

  productSave() {
    // console.log(this.productForm.value);
    if (this.productForm.value.productImg == "1") {
      this.image1.src = "./assets/images/p-1.png";
    } else if (this.productForm.value.productImg == "2") {
      this.image1.src = "./assets/images/p-2.png";
    } else if (this.productForm.value.productImg == "3") {
      this.image1.src = "./assets/images/p-3.png";
    } else if (this.productForm.value.productImg == "4") {
      this.image1.src = "./assets/images/p-4.png";
    } else if (this.productForm.value.productImg == "5") {
      this.image1.src = "./assets/images/p-5.png";
    }
    this.ptitle = this.productForm.value.productTitle;
    this.ptitleS = this.productForm.value.productTitleSize;
    this.ptitleC = this.productForm.value.productTitleColor;
    this.ptitleF = this.productForm.value.productTitleFont;
    this.pName = this.productForm.value.productName;
    this.pNameS = this.productForm.value.productSubtitleSize;
    this.pNameC = this.productForm.value.productSubtitleColor;
    this.pNameF = this.productForm.value.productSubtitleFont;
    this.ptime = this.productForm.value.productTime;
    this.pTimeS = this.productForm.value.productTimeSize;
    this.pTimeC = this.productForm.value.productTimeColor;
    this.pTimeF = this.productForm.value.productTimeFont;
    if (this.productForm.value.productTime == "1") {
      this.winTime = "01:00";
    } else if (this.productForm.value.productTime == "2") {
      this.winTime = "02:00";
    } else if (this.productForm.value.productTime == "3") {
      this.winTime = "03:00";
    } else if (this.productForm.value.productTime == "4") {
      this.winTime = "04:00";
    } else if (this.productForm.value.productTime == "5") {
      this.winTime = "05:00";
    }

  }

  toDataURL(url: any, callback: any) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  openTitle() {
    this.showTitle = true;
    this.showSubtitle = false;
    this.showPrizeImage = false;
    this.showWinTimer = false;
  }

  openSubtitle() {
    this.showSubtitle = true;
    this.showTitle = false;
    this.showPrizeImage = false;
    this.showWinTimer = false;
  }

  openPrizeImage() {
    this.showPrizeImage = true;
    this.showTitle = false;
    this.showSubtitle = false;
    this.showWinTimer = false;
  }

  openWinTimer() {
    this.showWinTimer = true;
    this.showTitle = false;
    this.showSubtitle = false;
    this.showPrizeImage = false;
  }

  closeTitle() {
    this.showTitle = false;
  }

  closeSubtitle() {
    this.showSubtitle = false;
  }

  closePrizeImage() {
    this.showPrizeImage = false;
  }

  closeWinTimer() {
    this.showWinTimer = false;
  }


  incrementTitleSize() {
    this.productForm.value.productTitleSize = ++this.productForm.value.productTitleSize;
    this.ptitleS = this.productForm.value.productTitleSize;
    this.productSave();
  }

  decrementTitleSize() {
    this.productForm.value.productTitleSize = --this.productForm.value.productTitleSize;
    this.ptitleS = this.productForm.value.productTitleSize;
    this.productSave();
  }

  incrementSubtitleSize() {
    this.productForm.value.productSubtitleSize = ++this.productForm.value.productSubtitleSize;
    this.pNameS = this.productForm.value.productSubtitleSize;
    this.productSave();
  }

  decrementSubtitleSize() {
    this.productForm.value.productSubtitleSize = --this.productForm.value.productSubtitleSize;
    this.pNameS = this.productForm.value.productSubtitleSize;
    this.productSave();
  }

  incrementTimeSize() {
    this.productForm.value.productTimeSize = ++this.productForm.value.productTimeSize;
    this.pTimeS = this.productForm.value.productTimeSize;
    this.productSave();
  }

  decrementTimeSize() {
    this.productForm.value.productTimeSize = --this.productForm.value.productTimeSize;
    this.pTimeS = this.productForm.value.productTimeSize;
    this.productSave();
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

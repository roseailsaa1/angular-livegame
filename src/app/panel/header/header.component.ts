import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private socialAuthService: SocialAuthService, private router: Router) { }

  ngOnInit(): void {
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
    this.router.navigate(['/']);
  }
}

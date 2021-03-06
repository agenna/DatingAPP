import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;

  constructor(public authService: AuthService,
              private alertify: AlertifyService,
              private route: Router) { }

  ngOnInit(): void {
    console.log('Nav Init');
    this.authService.currentPhotoUrl.subscribe(
      (photoUrl) => {
        this.photoUrl = photoUrl;
        console.log(photoUrl) ;
      });
  }

  login(): void{
    this.authService.login(this.model)
    .subscribe(
      () => {
        this.alertify.success('Logged successfully');
        this.route.navigate(['/members']);
      },
      err => {
        this.alertify.error(err); }
    );
    console.log(this.model);
  }

  loggedIn(): boolean{
    return this.authService.loggedIn();
  }

  logout(): void{
    console.log('logged out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.route.navigate(['/home']);
    this.alertify.message('logged out');
  }
}

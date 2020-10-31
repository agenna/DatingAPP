import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  login(): void{
    this.authService.login(this.model)
    .subscribe(
      () => {
        console.log('Logged successfully'); },
      err => {
        console.log(err); }
    );
    console.log(this.model);
  }

  loggedIn(){
    const token = localStorage.getItem('token');
    // se (token != null) return token else return null;
    return !!token;
  }

  logout(){
    localStorage.removeItem('token');
    console.log('logged out');
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private authService: AuthService,
              private alertify: AlertifyService) { }

  ngOnInit(): void {
  }

  register(): void {
    console.log(this.model);
    this.authService.register(this.model).subscribe(
      () => { this.alertify.success('user registered'); },
      (err) => {
        console.log('register error :');
        this.alertify.error(err);
      },
    );
  }

  cancel(): void {
    console.log('cancel');
    this.cancelRegister.emit(false);
  }

}

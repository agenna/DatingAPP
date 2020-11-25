import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  constructor(private authservice: AuthService,
              private userService: UserService,
              private alertifyService: AlertifyService) { }

  ngOnInit(): void {
  }

  sendLike(recipientId: number): void{
    this.userService.sendLike(this.authservice.decodedToken.nameid, recipientId).subscribe(
      () => { this.alertifyService.success('Like sent'); },
      err => { this.alertifyService.error(err); }
    );
  }

}

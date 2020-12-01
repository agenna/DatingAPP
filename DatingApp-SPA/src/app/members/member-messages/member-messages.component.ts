import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private userService: UserService,
              private authService: AuthService,
              private alertifyService: AlertifyService  ) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void{
    const userId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(userId, this.recipientId).pipe(
      tap(messages => {
        for (let i=0; i<messages.length; i++){
          console.log(messages[i]);
          if (!messages[i].isRead && messages[i].recipientId === userId) {
            this.userService.markAsRead(messages[i].id, userId);
          }
        }
      })
    )
    .subscribe(
      (messages) => {this.messages = messages; },
      (err) => {this.alertifyService.error(err); }
    );
  }

  sendMessage(): void{
    this.newMessage.recipientid = this.recipientId;
    console.log(this.newMessage);
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage).subscribe(
      (message: Message) => {
        this.messages.unshift(message);
        this.newMessage = {};
      },
      (error) => { this.alertifyService.error(error); }
    );
  }
}

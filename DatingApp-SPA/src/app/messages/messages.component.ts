import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../_models/message';
import { PaginatedResult, Pagination } from '../_models/Pagination';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})

export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer: 'Uread';

  constructor(private userService: UserService,
              private authService: AuthService,
              private alertifyService: AlertifyService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data
    .subscribe(
      (data) => {
        this.messages = data['messages'].result;
        this.pagination  = data['messages'].pagination;
      }
    );
  }

  loadMessages(): void {
    const userId = this.authService.decodedToken.nameid;
    this.userService.getMessages(userId, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer).subscribe(
        (response: PaginatedResult<Message[]>) => {
          this.messages = response.result;
          this.pagination  = response.pagination;
        },
        (err) => {this.alertifyService.error(err); }
      );
  }

  pageChanged(event: any): void{
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  deleteMessage(id: number){
    this.alertifyService.confirm("Are you sure you want to delete message?",
      () => {
        const userId = this.authService.decodedToken.nameid;
        this.userService.deleteMessage(id, userId).subscribe(
          () => {
            this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
            this.alertifyService.success("message deleted");
          },
          (err) => {this.alertifyService.error(err); }
        );
      });
  }
}

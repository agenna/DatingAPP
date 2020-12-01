import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';

/* const httpOption = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
}; */

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //il token è inserito automaticamente dalla libreria jwt (vedi app module)
  getUsers(page?, itemsPerPage?, userParams?, likeParams?): Observable<PaginatedResult<User[]>>{

    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null){
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (userParams != null){
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likeParams === 'Likers'){
      params = params.append('likers', 'true');
    }

    if (likeParams === 'Likees'){
      params = params.append('likees', 'true');
    }

    return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params})
      .pipe(
        map( response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null){
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getUser(id: number): Observable<User>{
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User){
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  setMainPhoto(userId: number, photoId: number){
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + photoId + '/setmain', {});
  }

  deletePhoto(userId: number, photoId: number){
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + photoId);
  }

  sendLike(id: number, recipientId: number){
    return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
  }

  getMessages(id: number, page?, itemsPerPage?, messageContainer?){

    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
    let params = new HttpParams();
    params = params.append('messageContainer', messageContainer);
    if (page != null && itemsPerPage != null){
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages' , {observe: 'response', params})
    .pipe(
      map( response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null){
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  getMessageThread(id: number, recipientId: number): Observable<Message[]>{
    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
  }

  sendMessage(id: number, message: Message){
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
  }

  deleteMessage(id: number, userid: number){
    return this.http.post(this.baseUrl + 'users/' + userid + '/messages/' + id, {});
  }

  markAsRead(id: number, userid: number){
    return this.http.post(this.baseUrl + 'users/' + userid + '/messages/' + id + '/read', {}).subscribe();
  }
}

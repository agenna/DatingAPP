import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';

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
  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.baseUrl + 'users');
  }

  getUser(id: number): Observable<User>{
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User){
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }
}

import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import { Observable, of } from 'rxjs';
import {UserService } from '../_services/user.service';
import {AlertifyService} from '../_services/alertify.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User[]>{

    pageNumber = 1;
    pageSize = 5;

    constructor(private userService: UserService,
                private alertifyService: AlertifyService,
                private router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertifyService.error('Problem retreiving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}

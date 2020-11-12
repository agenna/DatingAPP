import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import { Observable, of } from 'rxjs';
import {UserService } from '../_services/user.service';
import {AlertifyService} from '../_services/alertify.service';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../_services/auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User>{

    constructor(private userService: UserService,
                private alertifyService: AlertifyService,
                private authService: AuthService,
                private router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                this.alertifyService.error('Problem retreiving your data');
                this.router.navigate(['/members']);
                return of(null);
            })
        );
    }
}

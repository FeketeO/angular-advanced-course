import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { User } from '../model/user';
import { ConfigService } from './config.service';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginUrl = `${this.config.apiUrl}login`;
  logoutnUrl = `${this.config.apiUrl}logout`;
  currentUserSubject: BehaviorSubject<User> = new BehaviorSubject(null);
  lastToken: string = '';
  storageName = 'currentUser';



  constructor(
    private config: ConfigService,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
  ) { }

  //Írunk egy függvényt, amely kiolvassa a user pillanatnyi értékét.
  get currentUserValue() : User {
    return this.currentUserSubject.value;
  }

  //login
  login(loginData: User): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      this.loginUrl,
      { email: loginData.email, password: loginData.password }
    )
    .pipe( switchMap( response => {
      if (response.accessToken) {
        this.lastToken = response.accessToken;
        return this.userService.query(`email=${loginData.email}`);
      }
      return of(null);
    }))
    .pipe(
      tap( user => {
        if (!user) {
          localStorage.removeItem(this.storageName);
          this.currentUserSubject.next(null);
        } else {
          user[0].token = this.lastToken;
          localStorage.setItem(this.storageName, JSON.stringify(user[0]));
          this.currentUserSubject.next(user[0]);
        }
      })
    );
  }
//Végül kell egy router, amely segítségével elkészítjük a logout függvényt:
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['login'])


  }
}

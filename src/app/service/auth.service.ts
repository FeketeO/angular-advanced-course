import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/user';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginUrl = `${this.config.apiUrl}login`;
  logoutnUrl = `${this.config.apiUrl}logout`;
  currentUserSubject: BehaviorSubject<User> = new BehaviorSubject({});
  lastToken: string = '';



  constructor(
    private config: ConfigService,
    private http: HttpClient,
    private router: Router,
  ) { }

  //Írunk egy függvényt, amely kiolvassa a user pillanatnyi értékét.
  get currentUserValue() : User {
    return this.currentUserSubject.value;
  }

//Végül kell egy router, amely segítségével elkészítjük a logout függvényt:
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['login'])


  }
}

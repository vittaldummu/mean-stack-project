import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';
import { Router } from '@angular/router';
import { Http, Headers,RequestOptions} from '@angular/http';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  endpoint: string = 'http://localhost:3000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
    token ='';
  constructor(
    private http: HttpClient,
    public router: Router,
    public sessionService: SessionStorageService
  ) {
  }

    // Sign-up
    signUp(user: User): Observable<any> {
        let api = `${this.endpoint}/dashboard`;
        return this.http.post(api, user)
        .pipe(
            catchError(this.handleError)
        )
    }
    public getHttpOption(){
        
        if(this.sessionService.get('access_token')!=''){
            this.token = this.sessionService.get('access_token');
        }
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Token '+this.token
        });
        let options = new RequestOptions({ headers: headers });
        return options;
    }
    

  // Sign-in
    signIn(user: User) {
        return this.http.post<any>(`${this.endpoint}/signin`, user)
        .subscribe((res: any) => {
            console.log(res);
            this.sessionService.set('user_id', res._id)
            this.sessionService.set('UserDetail', res.UserDetail)
            this.sessionService.set('access_token', res.token)
            this.router.navigate(['dashboard/']);
        });
    }

  getToken() {
    return this.sessionService.get('access_token');
  }

 

  // User profile
  getUserProfile(id): Observable<any> {
    let api = `${this.endpoint}/user-profile/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  // Error 
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

/*Service API Call By Rabi*/
  getDataWithoutParam(apiObject): Observable<any>{
    return this.http.get<any>(this.endpoint+'/'+apiObject);
    // let url = this.endpoint+'/'+apiObject;
    // return this.http.get(url);
  }

  getByConditions(conditionParams, apiObject): Observable<any> {
    let url = this.endpoint+'/'+apiObject;
    return this.http.post(url, JSON.stringify(conditionParams));
  }
  putDataWithParam(param,apiObject):Observable<any>{
    let url = this.endpoint+'/'+apiObject;
    return this.http.put(url,param);
  }

  postDataWithParam(params,apiObject): Observable<any> {
    //console.log(params);
    let url = this.endpoint+'/'+apiObject;
    return this.http.post(url,params);
  }
  postDataWithoutParam(apiObject): Observable<any> {
    //console.log(params);
    let url = this.endpoint+'/'+apiObject;
    return this.http.post(url,{});
  }
  
}


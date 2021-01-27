import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse, } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable()
export class GenericService {

    // public base_api_url = 'http://172.20.7.177:8088/mcpikpiservice/report/';
    public base_api_url ='http://143.1.3.101:8088/mcpikpiservice/report/';
	
	public base_url = 'http://localhost:8080/';
    public site_url = 'http://localhost:4200/';
    public parent_directory ='';
    loggedInStatus: any = false;

    constructor(
            private http: HttpClient,
           public sessionService: SessionStorageService,
            private router: Router,
            private _http: Http
        )
        {
            // this.socket = io(this.socket_url);
        }
        private handleError(error: HttpErrorResponse):
            Observable<any> {
            //Log error in the browser console
           // console.error('observable error: ', error);

            return Observable.throw(error);
        }

    public getHttpOption(){

        let headers = new Headers({
        'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        return options;
    }
    
    getById(id, apiObject): Observable<any> {
        return this.http.get('/${apiObject}/${id}/');
    }
	
	getDataWithoutParam(ApiObject): Observable<any>{
		let url = this.base_api_url+ApiObject;
		return this.http.get(url);
	}
 
    getByConditions(conditionParams, apiObject) {
        return this.http.post('/${apiObject}/', JSON.stringify(conditionParams));
    }
	putDataWithParam(param,apiObject):Observable<any>{
		let url = this.base_api_url+apiObject;
		return this.http.put(url,param);
	}
    
	postDataWithParam(params, apiObject): Observable<any> {
		let url = this.base_api_url+apiObject;
        return this.http.post(url,params);
    }
	successfullLogin(param): Observable<any> {
       let url = 'http://172.20.7.177:8088/treasuryservice/treasury/login';
        return this.http.post(url,param);
    }


     
}





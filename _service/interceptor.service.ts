import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class InterceptorService implements HttpInterceptor {
    constructor(private router: Router) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
         
       const url = 'http://172.20.7.177:8088/mcpikpiservice/report/' ;
       const urlarr = req.url.split("://");
       if(urlarr.length > 1)
            {
                req = req.clone({

                    url: req.url
                });
            }
            else 
            {
                req = req.clone({

                    url: url + req.url
                });
        }
       
        return next.handle(req);
    }
}

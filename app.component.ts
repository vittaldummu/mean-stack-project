import { Component } from '@angular/core';
import { AuthService } from './_service/auth.service';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
	public loginuserid ='';
	public islogin= false;
  	constructor(public router: Router,public auth: AuthService,public sessionService: SessionStorageService) { }

  	ngOnInit() {
  		
  		// this.auth.postDataWithParam({'name':'Admin Dash','email':'admin@admin3.com','password':'admin'},'auth/adminRegistration').subscribe((res) => {
  		// });
		this.islogin =true;
		this.loginuserid=this.sessionService.get('user_id');
		console.log(this.loginuserid);
		if(this.loginuserid == '' || this.loginuserid == null){
			console.log(this.loginuserid);
			this.router.navigate(['login']);
		}
		

  	}

	
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from './../../_service/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';

@Component({
  selector: 'app-usertype',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {
  public currencylist = [];
  countrylist =[];
  formModel: any={};
  error=[];
  error_msg='';
  Investdate ='';
  success='';;
  loginuserid;
  islogin;
  constructor(
    public auth: AuthService,
    public router: Router,
    public sessionService: SessionStorageService
  ) {
     
      this.formModel.currency_name='';
      this.formModel.country_name='';
      this.formModel.currency_symbol='';
      this.formModel.is_active='Y';
  }

  ngOnInit() {
    this.auth.getDataWithoutParam('master/currencylist').subscribe((res) => {
      this.currencylist =res.data;
      
    })
    this.auth.getDataWithoutParam('master/countrylist').subscribe((res) => {
      this.countrylist =res.data;
      
    })

  }

  saveCurrency() {
    this.auth.postDataWithParam(this.formModel,'master/save_currency').subscribe((res) => {
      if (res.result) {
        console.log(res)
      }
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import * as cryptoJS from 'crypto-js';


@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {

  email = "";
  ip = "";
  dbName = "";
  secretKey = "";
  typeSend = "";
  campainID: any;
  idGetInfo: any;

  reason = "";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public http: HttpClient
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params) {
        let tokenDecrypt = this.decryptKey(params.token.replace(/ /g, "+"));
        let arrValue = tokenDecrypt.split("&");

        this.email = arrValue[0].split("=")[1];
        this.ip = arrValue[1].split("=")[1];
        this.dbName = arrValue[2].split("=")[1];
        this.secretKey = arrValue[3].split("=")[1];
        this.campainID = arrValue[4].split("=")[1];
        this.idGetInfo = arrValue[5].split("=")[1];
        this.typeSend = arrValue[6].split("=")[1];
      }
    });
  }

  resonIndex = 0;

  listReson = [
    { id: 1, name: "Your emails are not relevant to me" },
    { id: 2, name: "Your emails are too frequent" },
    { id: 3, name: "I no longer want to receive these emails" },
    { id: 4, name: "The emails are spam and should be reported" },
    { id: 5, name: "Others" }
  ]

  onChange(event) {
    this.resonIndex = Number(event.target.value)
  }

  onClickSubmit() {
    if (this.email.trim() != "") {
      let reason = "";
      if (this.resonIndex == 5) reason = this.reason
      else {
        let reasonObj = this.listReson.find(item => {
          return item.id == this.resonIndex;
        });
        if (reasonObj) reason = reasonObj.name;
      }


      this.http.post("http://118.27.192.106:3002//unsubscribe/email_unsubscribe",
        {
          ip: this.ip,
          dbName: this.dbName,
          secretKey: this.secretKey,
          email: this.email,
          campainID: this.campainID,
          reason,
          idGetInfo: this.idGetInfo,
          typeSend: this.typeSend,
        }).subscribe(() => {
          this.router.navigate(['done'])
        })
    }

  }

  onReasonChange(event) {
    this.reason = event.target.value;
  }

  decryptKey(value): string {
    var key = "CRM@NAP#JSC$123";
    key = cryptoJS.MD5(key).toString();
    var keyHex = cryptoJS.enc.Hex.parse(key);

    var options = {
      mode: cryptoJS.mode.ECB,
      padding: cryptoJS.pad.Pkcs7
    };

    var resultArray = cryptoJS.TripleDES.decrypt({
      ciphertext: cryptoJS.enc.Base64.parse(value)
    }, keyHex, options);

    return resultArray.toString(cryptoJS.enc.Utf8);
  }

}

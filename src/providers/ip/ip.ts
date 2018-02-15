import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the IpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IpProvider {

  public ipAddress: string;
  public ipArray: any[];

  constructor(public http: Http, private storage: Storage) {
    console.log('Hello IpProvider Provider');

  }

  //method to set the IP
  public setIP(ip) {
    this.ipAddress = ip;
  }

  public storeIP(ip) {
    this.ipArray = [];
    this.storage.get('ips').then((val) => {
      if (val != null) {
        this.ipArray = val;
      }
      this.ipArray.push(ip);
      this.storage.set('ips', this.ipArray);
    });

  }

  //method to get the IP
  public getIP() {
    return this.ipAddress;
  }

}

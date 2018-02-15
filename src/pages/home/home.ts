import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/catch';
import { Http } from '@angular/http';

import { DualIoPage } from '../dual-io/dual-io';

import { IpProvider } from '../../providers/ip/ip';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private ipAddress: string;
  private ipArray: any;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: Http, public ipProvider: IpProvider, public storage: Storage) {
    this.ipArray = [];
    this.storage.get('ips').then((val) => {
      this.ipArray = val;
    });
  }

  // Function that configures the IP and fetches the device details
  configure() {
    if (this.ipAddress != "" && this.ipAddress != null && this.ipAddress != undefined) {
      let ip = 'http://' + this.ipAddress + '/device/info';
      // Set the IP for global usage
      this.ipProvider.setIP('http://' + this.ipAddress);
      this.ipProvider.storeIP(this.ipAddress);
      this.storage.get('ips').then((val) => {
        this.ipArray = val;
        this.http.get(ip)
          .timeout(10000)
          .map(res => res.json()).subscribe(data => {
            // Check the type of the device and forward it to respective page 
            if (data.type == 'Dual') {
              this.navCtrl.push(DualIoPage);
            }
          },
          err => {
            // Alert if not able to connect to the device
            const alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: err,
              buttons: ['Dismiss']
            });
            alert.present();
          })
      });
    } else {
      // Alert if IP is wrong or no IP is provided
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Please provide a valid IP',
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }

  ipClick(ipAdr) {
    if (ipAdr != "" && ipAdr != null && ipAdr != undefined) {
      let ip = 'http://' + ipAdr + '/device/info';
      // Set the IP for global usage
      this.ipProvider.setIP('http://' + ipAdr);
      this.http.get(ip)
        .timeout(10000)
        .map(res => res.json()).subscribe(data => {
          // Check the type of the device and forward it to respective page 
          if (data.type == 'Dual') {
            this.navCtrl.push(DualIoPage);
          }
        },
        err => {
          // Alert if not able to connect to the device
          const alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: err,
            buttons: ['Dismiss']
          });
          alert.present();
        })
    } else {
      // Alert if IP is wrong or no IP is provided
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Could not connect to ip',
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }

}

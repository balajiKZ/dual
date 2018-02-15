import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/catch';
import { Http, Headers } from '@angular/http';

import { IpProvider } from '../../providers/ip/ip';

/**
 * Generated class for the DualIoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dual-io',
  templateUrl: 'dual-io.html',
})
export class DualIoPage {

  public selection: string = "onOff";
  private ipAddress: string;
  private cartridge1: boolean = false;
  private cartridge2: boolean = false;
  private murata1: boolean = false;
  private murata2: boolean = false;
  private murata3: boolean = false;
  private murata4: boolean = false;
  private blower1: boolean = false;
  private blower2: boolean = false;
  private timer = [
    {
      label: 'Cartridge 1',
      bodyLabel: 'cart1',
      onTime: 10,
      offTime: 50,
      status: false
    },
    {
      label: 'Cartridge 2',
      bodyLabel: 'cart2',
      onTime: 10,
      offTime: 50,
      status: false
    },
    {
      label: 'Murata 1',
      bodyLabel: 'mur1',
      onTime: 10,
      offTime: 50,
      status: false
    },
    {
      label: 'Murata 2',
      bodyLabel: 'mur2',
      onTime: 10,
      offTime: 50,
      status: false
    },
    {
      label: 'Murata 3',
      bodyLabel: 'mur3',
      onTime: 10,
      offTime: 50,
      status: false
    },
    {
      label: 'Murata 4',
      bodyLabel: 'mur4',
      onTime: 10,
      offTime: 50,
      status: false
    },
  ];
  private startClock: string = "22:00:00";
  private endClock: string = "06:00:00";
  private timerState: boolean = false;
  private onTime: number = 10;
  private offTime: number = 50;
  private cart1Name: string = "Cartridge 1";
  private cart2Name: string = "Cartridge 2";
  private activeCart: string = "Cartridge 1";
  private timerStateText: string = "OFF";
  private timerColor: string = "dark";
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public http: Http, public ipProvider: IpProvider) {
    this.ipAddress = ipProvider.getIP();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DualIoPage');
    this.enquireStatus();
  }
  // Function to activate the inputs in the device via HTTP
  setState(comp) {
    var state = "off";
    // get the current state of the component as per the user selection
    switch (comp) {
      case "cartridge1":
        if (this.cartridge1) {
          state = "on";
        } else {
          state = "off";
        }
        break;
      case "cartridge2":
        if (this.cartridge2) {
          state = "on";
        } else {
          state = "off";
        }
        break;
      case "murata1":
        if (this.murata1) {
          state = "on";
        } else {
          state = "off";
        }
        break;
      case "murata2":
        if (this.murata2) {
          state = "on";
        } else {
          state = "off";
        }
        break;
      case "murata3":
        if (this.murata3) {
          state = "on";
        } else {
          state = "off";
        }
        break;
      case "murata4":
        if (this.murata4) {
          state = "on";
        } else {
          state = "off";
        }
        break;
      case "blower1":
        if (this.blower1) {
          state = "on";
        } else {
          state = "off";
        }
        break;
      case "blower2":
        if (this.blower2) {
          state = "on";
        } else {
          state = "off";
        }
        break;
    }
    if (comp == "timer") {
      // In case of timer, first select the cartridge
      this.http.put(this.ipAddress + '/time/blow/element', { 'element': this.activeCart })
        .timeout(10000)
        .map(res => res.json()).subscribe(data => {
          // Next modify the time
          this.http.put(this.ipAddress + '/time/blow', { 'onTime': this.onTime, 'offTime': this.offTime })
            .timeout(10000)
            .map(res => res.json()).subscribe(data => {
              //Activate the timer as requested
              let ip = this.ipAddress + "/" + comp + "/" + state;
              // POST to the state to the device
              var body = {};
              this.http.post(ip, body)
                .timeout(10000)
                .map(res => res.json()).subscribe(data => {
                  // After invoking, get the status
                  this.enquireStatus();
                },
                err => {
                  // Alert if not able to connect to the device
                  const alert = this.alertCtrl.create({
                    title: 'Error',
                    subTitle: err,
                    buttons: ['Dismiss']
                  });
                  alert.present();
                });
            },
            err => {
              // Alert if not able to connect to the device
              const alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: err,
                buttons: ['Dismiss']
              });
              alert.present();
            });
        },
        err => {
          // Alert if not able to connect to the device
          const alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: err,
            buttons: ['Dismiss']
          });
          alert.present();
        });
    } else {
      let ip = this.ipAddress + "/" + comp + "/" + state;
      // POST to the state to the device
      var body = {};
      this.http.post(ip, body)
        .map(res => res.json()).subscribe(data => {
          // After invoking, get the status
          this.enquireStatus();
        },
        err => {
        });
    }
  }

  //Function that equires the status of the controls from arduino
  enquireStatus() {
    //Get the current status of all the inputs 
    this.http.get(this.ipAddress + '/status')
      .map(res => res.json()).subscribe(data => {
        this.cartridge1 = !!+data.cartridge1;
        this.cartridge2 = !!+data.cartridge2;
        this.murata1 = !!+data.murata1;
        this.murata2 = !!+data.murata2;
        this.murata3 = !!+data.murata3;
        this.murata4 = !!+data.murata4;
        this.blower1 = !!+data.blower1;
        this.blower2 = !!+data.blower2;
        this.timer[0].onTime = data.mur1_blow / 1000;
        this.timer[0].offTime = data.mur1_wait / 1000;
        this.timer[0].status = !!+data.cart1_timer_status;
        this.timer[1].onTime = data.mur3_blow / 1000;
        this.timer[1].offTime = data.mur3_wait / 1000;
        this.timer[1].status = !!+data.cart2_timer_status;
        this.timer[2].onTime = data.mur1_blow / 1000;
        this.timer[2].offTime = data.mur1_wait / 1000;
        this.timer[2].status = !!+data.mur1_timer_status;
        this.timer[3].onTime = data.mur2_blow / 1000;
        this.timer[3].offTime = data.mur2_wait / 1000;
        this.timer[3].status = !!+data.mur2_timer_status;
        this.timer[4].onTime = data.mur3_blow / 1000;
        this.timer[4].offTime = data.mur3_wait / 1000;
        this.timer[4].status = !!+data.mur3_timer_status;
        this.timer[5].onTime = data.mur4_blow / 1000;
        this.timer[5].offTime = data.mur4_wait / 1000;
        this.timer[5].status = !!+data.mur4_timer_status;
        let strtInt = parseInt(data.start.slice(0, data.start.indexOf(':'))) + 1;
        var strt;
        if (strtInt < 10) {
          strt = "0" + strtInt + data.start.slice(data.start.indexOf(':'));
        } else {
          strt = strtInt + data.start.slice(data.start.indexOf(':'));
        }
        let endInt = parseInt(data.stop.slice(0, data.stop.indexOf(':'))) + 1;
        var end;
        if (endInt < 10) {
          end = "0" + endInt + data.stop.slice(data.stop.indexOf(':'));
        } else {
          end = endInt + data.stop.slice(data.stop.indexOf(':'));
        }
        this.startClock = strt;
        this.endClock = end;
        this.activeCart = data.cartridge;
        //Get the scents in the cartridge
        this.http.get(this.ipAddress + '/cartridge/info')
          .map(res => res.json()).subscribe(data => {
            this.cart1Name = data.cartridge1;
            this.cart2Name = data.cartridge2;
          },
          err => {
            // Alert if not able to connect to the device
            const alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: err,
              buttons: ['Dismiss']
            });
            alert.present();
          });
      },
      err => {
        // Alert if not able to connect to the device
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: err,
          buttons: ['Dismiss']
        });
        alert.present();
      });
  }

  //Function to change the cartridge names
  changeNames() {
    if (this.cart1Name != '' && this.cart2Name != '') {
      this.http.put(this.ipAddress + '/cartridge/info', { "cartridge1": this.cart1Name, "cartridge2": this.cart2Name })
        .timeout(10000)
        .map(res => res.json()).subscribe(data => {
          // After invoking, get the status
          this.enquireStatus();
        },
        err => {
          // Alert if not able to connect to the device
          const alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: err,
            buttons: ['Dismiss']
          });
          alert.present();
        });
    }
  }

  feedTime() {
    if (this.startClock != '' && this.endClock != '') {
      var strtBodyInt = parseInt(this.startClock.slice(0, this.startClock.indexOf(':'))) - 1;
      var endBodyInt = parseInt(this.endClock.slice(0, this.endClock.indexOf(':'))) - 1;
      var strtBody
      if (strtBodyInt < 10) {
        strtBody = "0" + strtBodyInt + this.startClock.slice(this.startClock.indexOf(':'));
      } else {
        strtBody = strtBodyInt + this.startClock.slice(this.startClock.indexOf(':'));
      }
      var endBody
      if (endBodyInt < 10) {
        endBody = "0" + endBodyInt + this.endClock.slice(this.endClock.indexOf(':'));
      } else {
        endBody = endBodyInt + this.endClock.slice(this.endClock.indexOf(':'));
      }
      this.http.put(this.ipAddress + '/clock', { "start": strtBody, "stop": endBody })
        .timeout(10000)
        .map(res => res.json()).subscribe(data => {
          // After invoking, get the status
          this.enquireStatus();
        },
        err => {
          // Alert if not able to connect to the device
          const alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: err,
            buttons: ['Dismiss']
          });
          alert.present();
        });
    }
  }

  //Selecting the radio buttons
  timerToggle(item) {
    let addUrl = "off";
    if (item.status) {
      addUrl = "on";
    } else {
      addUrl = "off";
    }
    let ip = this.ipAddress + "/timer/" + addUrl;
    // POST to the state to the device
    var body = {
      timer: item.bodyLabel,
      onTime: item.onTime,
      offTime: item.offTime
    };
    console.log(ip);
    console.log(JSON.stringify(body));
    this.http.post(ip, body)
      .map(res => res.json()).subscribe(data => {
        // After invoking, get the status
        this.enquireStatus();
      },
      err => {
      });
  }

}

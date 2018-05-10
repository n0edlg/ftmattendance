import { Component } from '@angular/core';
import {ViewController, ModalController,  ActionSheetController,  NavController,  AlertController,  NavParams} from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { Person } from '../../data-classes/person';
import { Member } from '../../data-classes/member';

@Component({
  selector: 'group-info-popover-page',
  /*styleUrls: ['search.scss'],*/
  templateUrl: 'group-info-popover-page.html'
})
export class GroupInfoPopoverPage {

  

  constructor(public viewCtrl: ViewController) {

  }

  close() {
    this.viewCtrl.data.callback(this.viewCtrl.data);
    this.viewCtrl.dismiss();
  }

  public showBoysCheckbox_clickHandler() {
    this.viewCtrl.data.callback(this.viewCtrl.data);
  }

}

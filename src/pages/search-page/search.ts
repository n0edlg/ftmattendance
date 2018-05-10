import { Component } from '@angular/core';
import {ModalController, ActionSheetController,  NavController,  AlertController} from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { Person } from '../../data-classes/person';

@Component({
  selector: 'search-page',
  /*styleUrls: ['search.scss'],*/
  templateUrl: 'search.html'
})
export class SearchPage {

  public persons: Person[] = [];    
  public personResults: Person[] = [];

  constructor(public navCtrl: NavController, private dataService: DataService, 
    public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController,
    public modalCtrl: ModalController) {

  }

  ionViewDidLoad() {        
    //this.personResults = this.dataService.GetPersons();        
  }

  getItems(ev: any) {
      /*let allPersons:Person[] = this.dataService.GetPersons();
      this.personResults = allPersons; 

      // set val to the value of the searchbar
      let val:string = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
            this.personResults = allPersons.filter((item) => {
                return (item.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1) || 
                        (item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
      }*/
  }

}

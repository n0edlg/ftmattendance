import { Component, Input } from '@angular/core';
import {ViewController, ModalController,  ActionSheetController,  NavController,  AlertController,  NavParams} from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { Person } from '../../data-classes/person';
import { Member } from '../../data-classes/member';

@Component({
  selector: 'summary-calendar',
  styleUrls: ['/summary-calendar/summary-calendar.scss'],
  templateUrl: 'summary-calendar.html'
})
export class SummaryCalendar {

  public colData: any[] = [];
  public grid: Array<Array<any>> = [];

  private months: string[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  private _data: any;
  @Input('data')
  public set data(val: any) {
    this._data = val;

    this.colData.splice(0);

    for (let i:number = 0; i<this.months.length; i++) {
      this.colData.push({
        month: this.months[i],
        dates: [],
        dateGrid: []
      });
    }

    this.data.forEach(item => {      
      this.colData[item.date.getMonth()].dates.push({
        day: item.date.getDate(),
        isPresent: item.isPresent
      });
    });

    this.colData.forEach(data => {
      let rowNum = 0;
      for (let i = 0; i < data.dates.length; i+=4) {  
        data.dateGrid[rowNum] = [];  
        data.dateGrid[rowNum].push(data.dates[i]);
        data.dateGrid[rowNum].push(data.dates[i+1]);
        data.dateGrid[rowNum].push(data.dates[i+2]);
        data.dateGrid[rowNum].push(data.dates[i+3]);
        rowNum++;
      }
    });

    let rowNum = 0;
    for (let i = 0; i < this.colData.length; i+=2) {  
      this.grid[rowNum] = [];  
      this.grid[rowNum].push(this.colData[i]);
      //if (this.colData[i+1] != null) {
        this.grid[rowNum].push(this.colData[i+1]);
      //}
      rowNum++;
    }

    console.log("this.colData: ", this.colData);
  }

  public get data(): any {
    return this._data;
  }  

  constructor() {
    
  }


}

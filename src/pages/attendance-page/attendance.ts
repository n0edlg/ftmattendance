import { Component } from '@angular/core';
import { ModalController, ActionSheetController, NavController, AlertController, NavParams, PopoverController } from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { Person } from '../../data-classes/person';
import { Attendance } from '../../data-classes/attendance';
import { Member } from '../../data-classes/member';
import { GroupInfoPopoverPage } from '../group-info-popover-page/group-info-popover-page';

@Component({
  selector: 'attendance-page',
  /*styleUrls: ['search.scss'],*/
  templateUrl: 'attendance.html'
})
export class AttendancePage {

  public attendance: Attendance;
  public members: Member[] = [];
  public memberResults: Member[] = [];

  public age_groups: any[] = [
    {label: '3 below', min: 0, max: 2},
    {label: '3-6', min: 3, max: 6},
    {label: '7-9', min: 7, max: 9},
    {label: '10-12', min: 10, max: 12},
    {label: '12 above', min: 13, max: 999},
    {label: 'All', min: 0, max: 999}
  ];
  public selectedAgeGroup: any = this.age_groups[5];

  public gender_groups: any[] = [
    {label: 'Male', data: 'M'},
    {label: 'Female', data: 'F'},
    {label: 'All', data: 'All'}
  ];
  public selectedGenderGroup: any = this.gender_groups[2];

  public show_groups: any[] = [
    {label: 'All Attendees Only', data: true},
    {label: 'All Absentees Only', data: false},
    {label: 'All Members', data: 'all'}
  ];
  public selectedShowGroup: any = this.show_groups[2];

  constructor(public navCtrl: NavController, private navParams: NavParams, private dataService: DataService, 
    public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public popoverCtrl: PopoverController,
    public modalCtrl: ModalController) {

      this.attendance = navParams.get('attendance');
      this.members.splice(0);

      this.attendance.attendees.forEach(member_id => {
        let member: Member = this.dataService.GetMemberById(member_id);
        member.isPresent = true;
        this.members.push(member);
      });

      this.attendance.absentees.forEach(member_id => {
        let member: Member = this.dataService.GetMemberById(member_id);
        member.isPresent = false;
        this.members.push(member);
      });

      this.members.sort((a, b) => {
        if (a.lastname == b.lastname) {
          return a.firstname.toLowerCase().localeCompare(b.firstname.toLowerCase())
        }
        return a.lastname.toLowerCase().localeCompare(b.lastname.toLowerCase())
      });
      this.memberResults = this.members;
      console.log("this.memberResults: ", this.memberResults);
  }

  ionViewDidLoad() {        
    //this.personResults = this.dataService.GetPersons();        
  }

  public ageGroup_changeHandler() {
    console.log("ageGroup_changeHandler: ", this.selectedAgeGroup);
    this.filterMembers();
  }

  public genderGroup_changeHandler() {
    console.log("genderGroup_changeHandler: ", this.selectedGenderGroup);
    this.filterMembers();
  }

  private filterMembers() {
    this.memberResults = this.members.filter(
      member => {
       return (member.age >= this.selectedAgeGroup.min && member.age <= this.selectedAgeGroup.max) &&
              (this.selectedGenderGroup.data == 'All' ? true : member.gender.toLocaleLowerCase() == this.selectedGenderGroup.data.toLocaleLowerCase()) &&
              (this.selectedShowGroup.data == 'all' ? true : this.selectedShowGroup.data == member.isPresent);
    });    
  }

  private showBoys: boolean = true;
  private showGirls: boolean = true;
  private showAttendees: boolean = true;
  private showAbsentees: boolean = true;
  presentPopover(event) {
    let popover = this.popoverCtrl.create(
      GroupInfoPopoverPage, 
      {
        showBoys: this.showBoys,
        showGirls: this.showGirls,
        showAttendees: this.showAttendees,
        showAbsentees: this.showAbsentees,
        callback: this.popover_callbackHandler
      }
    );
    popover.present({
      ev: event
    });
  }

  popover_callbackHandler = (data: any) => {
    this.showBoys = data.showBoys;
    this.showGirls = data.showGirls;
    this.showAttendees = data.showAttendees;
    this.showAbsentees = data.showAbsentees;

    console.log("popover_callbackHandler: ", data);
    this.memberResults = this.members;
    if (data.showAttendees == true) {
      this.memberResults = this.members.filter(member => member.isPresent);
    }

    if (data.showAbsentees == true) {
      this.memberResults.concat(this.members.filter(member => !member.isPresent));
    }
    
    this.memberResults.sort((a, b) => {
      if (a.lastname == b.lastname) {
        return a.firstname.toLowerCase().localeCompare(b.firstname.toLowerCase())
      }
      return a.lastname.toLowerCase().localeCompare(b.lastname.toLowerCase())
    });
  }

  public getItems(ev: any) {
    this.memberResults = this.members;
    let val:string = ev.target.value;
    if (val && val.trim() != '') {
          this.memberResults = this.members.filter((item) => {
              return (item.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1) || 
                      (item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1);
          });
    }
  }

  public checkbox_clickHandler(member: Member) {    
    if (member.isPresent == true) {
      this.attendance.absentees.splice(this.attendance.absentees.indexOf(member.id), 1);
      this.attendance.attendees.push(member.id);
    }
    else {
      this.attendance.attendees.splice(this.attendance.attendees.indexOf(member.id), 1);
      this.attendance.absentees.push(member.id);
    }
    this.dataService.UpdateAttendance(this.attendance);
  }

}

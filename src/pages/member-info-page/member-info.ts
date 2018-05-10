import { Component } from '@angular/core';
import { ModalController, ActionSheetController, NavController, AlertController, NavParams } from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { Person } from '../../data-classes/person';
import { Member } from '../../data-classes/member';
import { Group } from '../../data-classes/group';

@Component({
  selector: 'member-info-page',
  /*styleUrls: ['search.scss'],*/
  templateUrl: 'member-info.html'
})
export class MemberInfoPage {

  public member: Member;
  public groups: Group[] = [];
  public group_attendances: any[] = [];

  public showPieChartLegend: boolean = false;
  public pieChartType:string = 'pie';
  public pieChartLabels:string[] = ['Presents', 'Absents'];
  public pieChartData:number[] = [];

  public onEdit: boolean = false;
  public birthdate: string;
  public selectedGroup: Group;
  public totalMemberAttendance: number;
  public totalGroupAttendances: number;
  public memberAttendancePercentage: number;  
  public calendarSummaryData: any[] = [];

  /** line chart variables */
  public lineChartData:Array<any> = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartType:string = 'line';
  public lineChartOptions: any = {
    responsive: true
  };
  public months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  /** calendar variables */
  public eventSource = [];
  public viewTitle;
  public isToday: boolean;
  public calendar = {
      mode: 'month',
      currentDate: new Date()
  };

  loadEvents() {
    this.eventSource = this.createRandomEvents();
  }
  onViewTitleChanged(title) {
      this.viewTitle = title;
  }
  onEventSelected(event) {
      console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }
  changeMode(mode) {
      this.calendar.mode = mode;
  }
  today() {
      this.calendar.currentDate = new Date();
  }
  onTimeSelected(ev) {
      console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
          (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
  }
  onCurrentDateChanged(event:Date) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      event.setHours(0, 0, 0, 0);
      this.isToday = today.getTime() === event.getTime();
  }
  createRandomEvents() {
      var events = [];
      for (var i = 0; i < 50; i += 1) {
          var date = new Date();
          var eventType = Math.floor(Math.random() * 2);
          var startDay = Math.floor(Math.random() * 90) - 45;
          var endDay = Math.floor(Math.random() * 2) + startDay;
          var startTime;
          var endTime;
          if (eventType === 0) {
              startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
              if (endDay === startDay) {
                  endDay += 1;
              }
              endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
              events.push({
                  title: 'All Day - ' + i,
                  startTime: startTime,
                  endTime: endTime,
                  allDay: true
              });
          } else {
              var startMinute = Math.floor(Math.random() * 24 * 60);
              var endMinute = Math.floor(Math.random() * 180) + startMinute;
              startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
              endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
              events.push({
                  title: 'Event - ' + i,
                  startTime: startTime,
                  endTime: endTime,
                  allDay: false
              });
          }
      }
      return events;
  }
  onRangeChanged(ev) {
      console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }
  markDisabled = (date:Date) => {
      var current = new Date();
      current.setHours(0, 0, 0);
      return date < current;
  };

  constructor(public navCtrl: NavController, private navParams: NavParams, private dataService: DataService, 
    public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController,
    public modalCtrl: ModalController) {

      this.member = navParams.get('member');
      if (this.member.birthdate != null) {
        this.birthdate = this.member.birthdate.toISOString();
      }

      this.member.groups.forEach(group_id => {
        this.groups.push(this.dataService.GetGroupById(group_id));                   
      });

      this.selectedGroup = this.groups[0];
      this.group_changeHandler();
  }

  public group_changeHandler() {
    console.log("group_changeHandler called. ", this.selectedGroup);
    let attendances = this.dataService.GetAttendancesByGroupId(this.selectedGroup.id);        
    /*
    attendances.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  
    let totalAttendance = this.dataService.GetTotalAttendanceByGroup(group_id, this.member);
    this.group_attendances.push({
      group: this.dataService.GetGroupById(group_id),
      attendances: attendances,
      totalAttendance: totalAttendance,
      totalAbsences: attendances.length - totalAttendance
    });
    */    
    
    this.eventSource.splice(0);
    this.calendarSummaryData.splice(0);
    
    attendances.forEach(attendance => {
      let date: Date = new Date(attendance.date);
      this.eventSource.push({
        title: '',
        startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, date.getMinutes()),
        endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 2, date.getMinutes()),
        allDay: false,
        isPresent: attendance.attendees.indexOf(this.member.id) != -1
      });     
      
      this.calendarSummaryData.push({
        date: date,
        isPresent: attendance.attendees.indexOf(this.member.id) != -1
      });
    });
        
    this.lineChartData.splice(0);
    this.lineChartLabels.splice(0);
    let groupAttendanceData: any = {};
    groupAttendanceData.label = "Percentage";
    groupAttendanceData.data = [];
    for (let i=0; i<12; i++) {
      let attendanceByMonth = attendances.filter(attendance => new Date(attendance.date).getMonth() == i);
      if (attendanceByMonth.length > 0) {
        this.lineChartLabels.push(this.months[i]);
        let memberMonthlyAttendance: number = attendanceByMonth.filter(attendance => attendance.attendees.indexOf(this.member.id) != -1).length;
        groupAttendanceData.data.push(Math.round(memberMonthlyAttendance / attendanceByMonth.length * 100));
      }
    }
    this.lineChartData.push(groupAttendanceData);

    this.totalMemberAttendance = this.dataService.GetTotalAttendanceByGroup(this.selectedGroup.id, this.member);
    this.totalGroupAttendances = attendances.length;
    this.memberAttendancePercentage = Math.round(this.totalMemberAttendance / this.totalGroupAttendances * 100);
  }

  ionViewDidLoad() {        
          
  }

  public editSavebtn_clickHandler() {
    this.onEdit = !this.onEdit;
    if (!this.onEdit) {      
      if (this.birthdate != null) {
        this.member.birthdate = new Date(this.birthdate);
      }            
      this.dataService.UpdateMember(this.member).subscribe(data => {
        this.dataService.showToast("Member updated successfully!");
        if (this.member.birthdate != null) {
          this.member.age = Math.floor(((Date.now() - new Date(this.member.birthdate).getTime()) / (1000 * 3600 * 24)) / 365);
        }
      }, error => {
        this.dataService.showToast("Member update error!");        
      });

    }
  }

  public tpointsAddOrSubBtn_clickHandler(toAdd: boolean) {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Select Points",
      buttons: [
          {
            text: '5',
            handler: () => {                
                this.member.tpoints += toAdd ? 5 : -5;
                this.dataService.UpdateMember(this.member);
            }
          },
          {
            text: '10',
            handler: () => {
              this.member.tpoints += toAdd ? 10 : -10;
              this.dataService.UpdateMember(this.member);
            }
          },
          {
            text: '20',
            handler: () => {                
                this.member.tpoints += toAdd ? 20 : -20;
                this.dataService.UpdateMember(this.member);
            }
          },
          {
            text: '50',
            handler: () => {                
                this.member.tpoints += toAdd ? 50 : -50;
                this.dataService.UpdateMember(this.member);
            }
          },
          {
            text: '100',
            handler: () => {                
                this.member.tpoints += toAdd ? 100 : -100;
                this.dataService.UpdateMember(this.member);
            }
          },
          {
            text: 'Other',
            handler: () => {                
                this.showAddPointsAlert(toAdd);
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                console.log('Cancel clicked');        
            }
          }
      ]
      });
      actionSheet.present();
  }

  private showAddPointsAlert(toAdd: boolean) {
    let prompt = this.alertCtrl.create({
      title: toAdd ? 'Add' : 'Subtract' + ' Points',
      //message: "Enter a name for your playlist:",
      inputs: [
          {
            name: 'points',
            placeholder: 'Input Points'
          }
      ],
      buttons: [
          {
            text: 'Cancel',
            handler: data => {
                console.log('Cancel clicked');
            }
          },
          {
            text: toAdd ? 'Add' : 'Subtract',
            handler: data => {
              this.member.tpoints += toAdd ? Number(data.points) : -Number(data.points);
              this.dataService.UpdateMember(this.member);
            }
          }
      ]
    });
    prompt.present();
  }

}

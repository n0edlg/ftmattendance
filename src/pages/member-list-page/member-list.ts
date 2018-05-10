import { GroupInfoPopoverPage } from '../group-info-popover-page/group-info-popover-page';
import { AttendancePage } from '../attendance-page/attendance';
import { Component } from '@angular/core';
import {PopoverController, NavParams,  ModalController,   ActionSheetController,    NavController,    AlertController} from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { Person } from '../../data-classes/person';
import { Group } from '../../data-classes/group';
import { Member } from '../../data-classes/member';
import { Attendance } from '../../data-classes/attendance';
import { MemberInfoPage } from '../member-info-page/member-info';
import { Angular2Csv } from 'angular2-csv';
import { DatePicker } from '@ionic-native/date-picker';

@Component({
  selector: 'member-list-page',
  styleUrls: ['/member-list-page/member-list.scss'],
  templateUrl: 'member-list.html'
})
export class MemberListPage {

  public group: Group;
  public members: Member[] = [];
  public memberResults: Member[] = [];
  public attendances: Attendance[] = [];
  public attendancesResults: Attendance[] = [];
  public membersLeaderboard: any[] = [];
  public segmentTab: string = "members";

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Attendees'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Absentees'}
  ];
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
 
  public randomize():void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }

  public showPieChartLegend: boolean = false;
  public pieChartType:string = 'pie';
  public pieChartLabels:string[] = ['Attendees', 'Absentees'];
  public pieChartData:number[] = [];

  constructor(public navCtrl: NavController, private navParams: NavParams, private dataService: DataService, 
    public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public popoverCtrl: PopoverController,
    public modalCtrl: ModalController, private datePicker: DatePicker) {
      this.group = navParams.get('group');
      this.members.splice(0);
      this.group.members.forEach(member_id => {
        this.members.push(this.dataService.GetMemberById(member_id));
      });
      this.members.sort((a, b) => {
        if (a.lastname == b.lastname) {
          return a.firstname.toLowerCase().localeCompare(b.firstname.toLowerCase())
        }
        return a.lastname.toLowerCase().localeCompare(b.lastname.toLowerCase())
      });
      this.memberResults = this.members;

      this.attendances = this.dataService.Attendances.filter(attendance => attendance.group_id == this.group.id);
      this.attendancesResults = this.attendances;
      this.attendancesResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      console.log("constructor constructor constructor constructor");
  }

  ionViewDidLoad() {        
    console.log("ionViewDidLoad ionViewDidLoad ionViewDidLoad ionViewDidLoad");
    //this.personResults = this.dataService.GetPersons();  
  }  

  public attendanceFromDate: string;
  public attendanceToDate: string;
  public segmentChanged(event) {
    console.log("segmentChanged: ", this.attendancesResults, this.attendances);
    switch (this.segmentTab) {
      case 'stats':
        let attendeesData: any = {data: [], label: 'Attendees'};
        let absenteesData: any = {data: [], label: 'Absentees'};
        this.barChartLabels.splice(0);
        this.attendances.forEach(attendance => {
          this.barChartLabels.push(attendance.date.toString());
          attendeesData.data.push(attendance.attendees.length);
          absenteesData.data.push(attendance.absentees.length);
        });
        this.barChartData.splice(0);
        this.barChartData.push(attendeesData);
        this.barChartData.push(absenteesData);

        this.attendanceFromDate = this.attendanceFromDate ? this.attendanceFromDate : new Date("01/01/2017").toDateString();
        this.attendanceToDate = this.attendanceToDate ? this.attendanceToDate : new Date().toDateString();
        this.attendanceDate_changeHandler();
        break;
    }
  }

  public attendanceDate_changeHandler() {
    console.log("attendanceDate_changeHandler called.");
    let includedAttendances: Attendance[] = this.dataService.GetAttendancesFromTo(new Date(this.attendanceFromDate), new Date(this.attendanceToDate));
    this.membersLeaderboard.splice(0);
    this.members.forEach(member => {
      let totalAttendance = this.dataService.GetTotalAttendance(includedAttendances, member);
      this.membersLeaderboard.push({
        member: member,
        totalAttendance: totalAttendance,
        percentage: Math.ceil(totalAttendance / includedAttendances.length * 100)
      });
    });
    this.membersLeaderboard.sort((a, b) => b.totalAttendance - a.totalAttendance);
  }

  public attendanceFromDate_clickHandler() {
    console.log("attendanceFromDate_clickHandler called.");
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        this.attendanceFromDate = date.toDateString();
        this.attendanceDate_changeHandler();
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  public attendanceToDate_clickHandler() {
    console.log("attendanceToDate_clickHandler called.");
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        this.attendanceToDate = date.toDateString();
        this.attendanceDate_changeHandler();
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  public exportCSV_clickHandler() {
    let data = [];

    this.membersLeaderboard.forEach(item => {
      //if (item.percentage >= 60) {
        //data.push("\"" + item.member.lastname + ", " + item.member.firstname + "\"," + item.totalAttendance + ",\"" + item.percentage + "%\"");
        data.push({
          name: item.member.lastname + ", " + item.member.firstname,
          gender: item.member.gender,
          age: item.member.age,
          totalAttendance: item.totalAttendance,
          percentage: item.percentage + "%"
        });
      //}      
    });
    
    this.dataService.sendAttendanceReportViaEmail(this.group.name, new Date(this.attendanceFromDate), new Date(this.attendanceToDate), data);
    //console.log("CSV: ", new Angular2Csv(data, this.group.name + "_" + this.dataService.toShortDateString(new Date(this.attendanceFromDate)) + "-" + this.dataService.toShortDateString(new Date(this. attendanceToDate))));
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

  public member_clickHandler(member: Member) {
    this.navCtrl.push(MemberInfoPage, { member: member });
  }

  public attendance_clickHandler(attendance: Attendance) {
    this.navCtrl.push(AttendancePage, { attendance: attendance });
  }

  public addMember_clickHandler() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Add Member",
      buttons: [
          {
            text: 'Add Existing Members',
            handler: () => {                
                this.showAddExistingMemberAlert();
            }
          },
          {
            text: 'Add New Member',
            handler: () => {                
                this.showAddNewMemberAlert();
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

  public showAddNewMemberAlert(): void {
    let member: Member = new Member();

    let prompt = this.alertCtrl.create({
      title: 'Add Member',
      //message: "Enter a name for your playlist:",
      inputs: [
          {
            name: 'firstname',
            placeholder: 'Firstname'
          },
          {
            name: 'middlename',
            placeholder: 'Middlename'
          },
          {
            name: 'lastname',
            placeholder: 'Lastname'
          },
          {
            name: 'gender',
            placeholder: 'Gender'
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
            text: 'Add',
            handler: data => {
                console.log('Add clicked', data);
                member.firstname = data.firstname;
                member.middlename = data.middlename;
                member.lastname = data.lastname;
                //member.birthdate = data.birthdate;
                member.gender = data.gender;
                member.groups = [this.group.id];                
                this.dataService.AddMember(member).subscribe((data: Member) => {
                  console.log("sadasfasfa: ", data);
                  this.group.members.push(data.id);
                  this.members.push(this.dataService.GetMemberById(data.id));
                  this.members.sort((a, b) => {
                    if (a.lastname == b.lastname) {
                      return a.firstname.toLowerCase().localeCompare(b.firstname.toLowerCase())
                    }
                    return a.lastname.toLowerCase().localeCompare(b.lastname.toLowerCase())
                  });
                  this.memberResults = this.members;
                  this.dataService.UpdateGroup(this.group);
                });
            }
          }
      ]
    });
    prompt.present();
  }  

  public showAddExistingMemberAlert() {
    let members: Member[] = this.dataService.Members.sort((a, b) => {
      if (a.lastname == b.lastname) {
        return a.firstname.toLowerCase().localeCompare(b.firstname.toLowerCase())
      }
      return a.lastname.toLowerCase().localeCompare(b.lastname.toLowerCase())
    });

    let alert = this.alertCtrl.create();
    alert.setTitle('Select Members');

    members.forEach(member => {
        alert.addInput({
            type: 'checkbox',
            label: member.lastname + ', ' + member.firstname,
            value: member.id
        });
    });        

    alert.addButton({
    text: 'Cancel',
    handler: () => {            

    }
    });
    alert.addButton({
    text: 'OK',
    handler: data => {
        //this.dataService.AddSongToPlaylist(selectedPlaylist, song);            
        console.log("asdasfasfasfas : ", data);
        this.group.members = this.group.members.concat(data);
        this.dataService.UpdateGroup(this.group);

        data.forEach(member_id => {
          let member = this.dataService.GetMemberById(member_id);
          member.groups.push(this.group.id);
          this.dataService.UpdateMember(member);
        });        

        this.members.splice(0);
        this.group.members.forEach(member_id => {
          this.members.push(this.dataService.GetMemberById(member_id));
        });
        this.members.sort((a, b) => {
          if (a.lastname == b.lastname) {
            return a.firstname.toLowerCase().localeCompare(b.firstname.toLowerCase())
          }
          return a.lastname.toLowerCase().localeCompare(b.lastname.toLowerCase())
        });
        this.memberResults = this.members;
    }
    });
    alert.present();
  }

  public addAttendance_clickHandler() {
    let attendance: Attendance = new Attendance();
    
    let prompt = this.alertCtrl.create({
      title: 'Add Attendance',
      //message: "Enter a name for your playlist:",
      inputs: [
          {
            name: 'name',
            placeholder: 'Name (optional)'
          },
          {
            name: 'date',
            placeholder: 'Date',
            value: new Date().toLocaleDateString()
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
            text: 'Add',
            handler: data => {
                console.log('Add clicked', data);
                attendance.name = data.name;
                attendance.date = data.date;
                attendance.group_id = this.group.id;
                attendance.attendees = [];
                attendance.absentees = [];
                this.group.members.forEach(member_id => {
                  attendance.absentees.push(member_id);
                });
                this.dataService.AddAttendance(attendance).subscribe((data: Attendance) => {
                  console.log("AddAttendance: ", data);
                  //this.attendances.push(data);
                  this.attendancesResults = this.dataService.Attendances.filter(attendance => attendance.group_id == this.group.id);
                  this.attendancesResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                });
            }
          }
      ]
    });
    prompt.present();
  }

  public memberOptions_clickHandler(event: any, member: Member) {
    event.stopPropagation();

    let actionSheet = this.actionSheetCtrl.create({
    title: member.firstname + " " + member.lastname,
    buttons: [
        {
        text: 'Add to Attendance',
        role: 'destructive',
        handler: () => {                
            this.selectAttendance(member);
        }
        },{
        text: 'Edit Profile',
        handler: () => {
            
        }
        },{
        text: 'Remove Member',
        handler: () => {
            this.showConfirmOnRemoveMember(member);
        }
        },{
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

  selectAttendance(member: Member) {    
    let selectedAttendance: Attendance;
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Attendance');

    this.attendances.filter(attendance => attendance.attendees.concat(attendance.absentees).findIndex(member_id => member_id == member.id) == -1).forEach(item => {
        alert.addInput({
            type: 'radio',
            label: item.date.toString(),
            value: item.id,
            handler: () => {
              selectedAttendance = item;
            }
        });
    });        

    alert.addButton({
    text: 'Cancel',
    handler: () => {            

    }
    });
    alert.addButton({
    text: 'OK',
    handler: () => {                
        if (selectedAttendance != null) {
          selectedAttendance.absentees.push(member.id);
          this.dataService.UpdateAttendance(selectedAttendance);
        }
    }
    });
    alert.present();
}

  showConfirmOnRemoveMember(member: Member) {
    let confirm = this.alertCtrl.create({
    title: 'Remove Member',
    message: 'Are you sure you want to remove ' + member.firstname + ' ' + member.lastname + '?',
    buttons: [
        {
        text: 'No',
        handler: () => {
            console.log('Disagree clicked');
        }
        },
        {
        text: 'Yes',
        handler: () => {
            console.log('Agree clicked');                        
            //this.dataService.RemoveMember(member).subscribe((data: Member) => {
              this.group.members.splice(this.group.members.indexOf(member.id), 1);
              this.members.splice(this.members.indexOf(member), 1);          
              this.memberResults = this.members;
              this.dataService.UpdateGroup(this.group);
            //});
        }
        }
    ]
    });
    confirm.present();
  }

  public attendanceOptions_clickHandler(event: any, attendance: Attendance) {
    event.stopPropagation();
    
    let actionSheet = this.actionSheetCtrl.create({
    title: attendance.date + "",
    buttons: [
        {
          text: 'Delete Attendance',
          handler: () => {
              this.showConfirmOnRemoveAttendance(attendance);
          }
        },{
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

  showConfirmOnRemoveAttendance(attendance: Attendance) {
    let confirm = this.alertCtrl.create({
    title: 'Delete Attendance',
    message: 'Are you sure you want to delete ' + attendance.date + '?',
    buttons: [
        {
        text: 'No',
        handler: () => {
            console.log('Disagree clicked');
        }
        },
        {
        text: 'Yes',
        handler: () => {
            console.log('Agree clicked');                        
            this.dataService.RemoveAttendance(attendance).subscribe((data: Attendance) => {
              this.attendances = this.dataService.Attendances.filter(attendance => attendance.group_id == this.group.id);
              this.attendancesResults = this.attendances;
              this.attendancesResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            });
        }
        }
    ]
    });
    confirm.present();
  }  
}

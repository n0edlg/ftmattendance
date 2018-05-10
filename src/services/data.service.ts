import { Attendance } from '../data-classes/attendance';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { LocalStorageManagerService } from './local-storage-manager.service';
import { CloudStorageManagerService } from './cloud-storage-manager.service';
import { AlertController, ToastController } from 'ionic-angular';
import { Group } from '../data-classes/group';
import { Member } from '../data-classes/member';
import { Category } from '../data-classes/category';
import { Subject } from 'rxjs/Subject';
import { EmailComposer } from '@ionic-native/email-composer';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';

@Injectable()
export class DataService {
    private _attendances: Attendance[] = [];
    private _members: Member[] = [];
    private _groupList: Group[] = [];
    private _categories: Category[] = [];
    private membersSubscription: Subscription;
    private categoriesSubscription: Subscription;
    private groupListSubscription: Subscription;
    private attendancesSubscription: Subscription;
    public categoriesSubject: Subject<any> = new Subject();

    constructor(private localStorageManager: LocalStorageManagerService,
                private cloudStorageManager: CloudStorageManagerService,
                private alertCtrl: AlertController,
                private toastCtrl: ToastController,
                private emailComposer: EmailComposer, 
                private file: File,
                private socialSharing: SocialSharing) {        

        this.groupListSubscription = this.cloudStorageManager.RetrieveGroups().subscribe(snapshots => {    
            this._groupList.splice(0);      
            snapshots.forEach(snapshot => {
                let grp: Group = snapshot.val();
                if (grp.members == null) {
                    grp.members = [];
                }
                this._groupList.push(grp);
            });            
        });

        this.categoriesSubscription = this.cloudStorageManager.RetrieveCategories().subscribe(snapshots => {    
            this._categories.splice(0);      
            snapshots.forEach(snapshot => {
                let category: Category = snapshot.val();
                if (category.groups == null) {
                    category.groups = [];
                }
                this._categories.push(category);
            });
            this.categoriesSubject.next();
        });

        this.membersSubscription = this.cloudStorageManager.RetrieveMembers().subscribe(snapshots => {    
            this._members.splice(0);      
            snapshots.forEach(snapshot => {
                let member: Member = Member.fromJson(snapshot.val());                                
                this._members.push(member);
            });
        });

        this.attendancesSubscription = this.cloudStorageManager.RetrieveAttendances().subscribe(snapshots => {    
            this._attendances.splice(0);      
            snapshots.forEach(snapshot => {
                let attendance: Attendance = snapshot.val();
                if (attendance.absentees == null) {
                    attendance.absentees = [];
                }
                if (attendance.attendees == null) {
                    attendance.attendees = [];
                }
                this._attendances.push(attendance);
            });            
        });
    }

    public get Attendances(): Attendance[] {
        return this._attendances;
    }

    public get Members(): Member[] {
        return this._members;
    }

    public get GroupList(): Group[] {
        return this._groupList;
    }

    public get Categories(): Category[] {
        return this._categories;
    }

    public GetMemberById(member_id: any): Member {
        return this._members.find(member => member.id == member_id);
    }

    public GetGroupById(group_id: any): Group {
        return this._groupList.find(group => group.id == group_id);
    }

    public GetAttendancesByGroupId(group_id: any): Attendance[] {
        return this._attendances.filter(attendance => attendance.group_id == group_id);
    }

    public AddMember(member: Member): Observable<any> {
        return this.cloudStorageManager.AddMember(member);
    }

    public AddAttendance(attendance: Attendance): Observable<any> {
        return this.cloudStorageManager.AddAttendance(attendance);
    }

    public AddGroup(group: Group): Observable<any> {
        return this.cloudStorageManager.AddGroup(group);
    }

    public AddCategory(category: Category): Observable<any> {
        return this.cloudStorageManager.AddCategory(category);
    }

    public RemoveMember(member: Member): Observable<any> {
        return this.cloudStorageManager.RemoveMember(member);
    }

    public RemoveAttendance(attendance: Attendance): Observable<any> {
        return this.cloudStorageManager.RemoveAttendance(attendance);
    }

    public UpdateMember(member: Member): Observable<any> {
        return this.cloudStorageManager.UpdateMember(member);
    }

    public UpdateGroup(group: Group) {
        this.cloudStorageManager.UpdateGroup(group);
    }

    public UpdateCategory(category: Category) {
        this.cloudStorageManager.UpdateCategory(category);
    }

    public UpdateAttendance(attendance: Attendance) {
        this.cloudStorageManager.UpdateAttendance(attendance);
    }

    public GetMembersByAgeGroup(fromAge: number, toAge: number): Member[] {
        return this._members.filter(member => member.age >= fromAge && member.age <= toAge);
    }

    public GetMembersByGroupId(group_id: any) {
        return this.GetGroupById(group_id).members;
    }

    public GetTotalAttendanceByGroup(group_id: any, member: Member): number {
        let totalAttendance: number = 0;
        let attendances = this.GetAttendancesByGroupId(group_id);        
        attendances.forEach(attendance => {
            if (attendance.attendees.indexOf(member.id) != -1) {
                totalAttendance++;
            }
        });
        return totalAttendance;
    }

    public GetTotalAttendance(attendances: Attendance[], member: Member): number {
        let totalAttendance: number = 0;      
        attendances.forEach(attendance => {
            if (attendance.attendees.indexOf(member.id) != -1) {
                totalAttendance++;
            }
        });
        return totalAttendance;
    }

    public GetAttendancesFromTo(fromDate: Date, toDate: Date): Attendance[] {
        return this._attendances.filter(attendance => new Date(attendance.date).getTime() >= fromDate.getTime() && new Date(attendance.date).getTime() <= toDate.getTime());
    }

    public showBasicAlert(title:string, msg:string) {
        let alert = this.alertCtrl.create({
        title: title,
        subTitle: msg,
        buttons: ['OK']
        });
        alert.present();
    }

    public showToast(msg:string) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    }

    public toShortDateString(date: Date): string {
        return date.getMonth() + 1 + "_" + date.getDate() + "_" + date.getFullYear();
    }

    public convertToCSV(data: any[]) {        
        const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here                
        const headers = Object.keys(data[0])
                
        var csv = data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))    
        csv.unshift(headers.join(','))
            
        return csv.join('\r\n');     
    }

    public sendAttendanceReportViaEmail(group_name: string, fromDate: Date, toDate: Date, report_data: any) {
        let filename = group_name.replace(/\s/ig, "_") + "_" + this.toShortDateString(fromDate) + "_" + this.toShortDateString(toDate) + ".csv";
        console.log("filename: ", filename);
        this.file.writeFile(this.file.externalDataDirectory, filename, this.convertToCSV(report_data), {replace: true}).then(()=> {
            /*this.socialSharing.shareViaEmail('Body', 'Subject', ['bautistagideon@gmail.com'], [], [], [fileDestiny + fileName]).then(() => {
                this.showToast("socialSharing SUCCESS!!!");
              }).catch(() => {
                this.showToast("socialSharing FAILURE!!!");
            });*/

            let email = {
                app: 'gmail',
                to: '',
                cc: '',
                bcc: [],
                attachments: [this.file.externalDataDirectory + filename],
                subject: group_name + ' Attendance Report from ' + fromDate.toDateString() + ' to ' + toDate.toDateString(),
                body: 'Please see attached file.',
                isHtml: true
              };
              
              this.emailComposer.open(email);
        }).catch(()=>{

        });
    }       
}
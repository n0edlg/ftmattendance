import { Attendance } from '../data-classes/attendance';
import { Observable } from 'rxjs/Rx';
import { Group } from '../data-classes/group';
import { Member } from '../data-classes/member';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Category } from '../data-classes/category';

export class CloudStorageKey {
    public static KEY_MEMBERS = "members";
    public static KEY_GROUPS = "groups";
    public static KEY_CATEGORIES = "categories";
    public static KEY_ATTENDANCES = "attendances";    
}

@Injectable()
export class CloudStorageManagerService {

    constructor(
        private angularFireDatabase: AngularFireDatabase
    ) {

    }

    public AddGroup(group: Group) {
        return Observable.create(observer => {
            this.angularFireDatabase.list(CloudStorageKey.KEY_GROUPS).push(group).then(data => {            
                data.update({
                    id: data.key
                });
                group.id = data.key;
                observer.next(group);
            });
        });
    }

    public UpdateGroup(group: Group) {
        this.angularFireDatabase.list(CloudStorageKey.KEY_GROUPS).update(group.id, group);
    }

    public RetrieveGroups(): FirebaseListObservable<any[]> {
        return this.angularFireDatabase.list(CloudStorageKey.KEY_GROUPS, { preserveSnapshot: true});
    }

    public AddMember(member: Member): Observable<any> {
        return Observable.create(observer => {
            this.angularFireDatabase.list(CloudStorageKey.KEY_MEMBERS).push(member.toJson()).then(data => {            
                data.update({
                    id: data.key
                });
                member.id = data.key;
                observer.next(member);
            });
        });
    }

    public RemoveMember(member: Member): Observable<any> {        
        return Observable.create(observer => {
            this.angularFireDatabase.object(CloudStorageKey.KEY_MEMBERS + '/' + member.id).remove().then(data => {
                observer.next(member);
            });
        });
    }

    public UpdateMember(member: Member): Observable<any> {
        return Observable.create(observer => {
            this.angularFireDatabase.list(CloudStorageKey.KEY_MEMBERS).update(member.id, member.toJson()).then(data => {
                observer.next(member);
            }, error => {
                observer.error();
            });
        });
    }

    public RetrieveMembers(): FirebaseListObservable<any[]> {
        return this.angularFireDatabase.list(CloudStorageKey.KEY_MEMBERS, { preserveSnapshot: true});
    }

    public AddAttendance(attendance: Attendance): Observable<any> {
        return Observable.create(observer => {
            this.angularFireDatabase.list(CloudStorageKey.KEY_ATTENDANCES).push(attendance).then(data => {            
                data.update({
                    id: data.key
                });
                attendance.id = data.key;
                observer.next(attendance);
            });
        });
    }

    public RemoveAttendance(attendance: Attendance): Observable<any> {        
        return Observable.create(observer => {
            this.angularFireDatabase.object(CloudStorageKey.KEY_ATTENDANCES + '/' + attendance.id).remove().then(data => {
                observer.next(attendance);
            });
        });
    }

    public UpdateAttendance(attendance: Attendance) {
        this.angularFireDatabase.list(CloudStorageKey.KEY_ATTENDANCES).update(attendance.id, attendance);
    }

    public RetrieveAttendances(): FirebaseListObservable<any[]> {
        return this.angularFireDatabase.list(CloudStorageKey.KEY_ATTENDANCES, { preserveSnapshot: true});
    }

    public AddCategory(category: Category): Observable<any> {
        return Observable.create(observer => {
            this.angularFireDatabase.list(CloudStorageKey.KEY_CATEGORIES).push(category).then(data => {            
                data.update({
                    id: data.key
                });
                category.id = data.key;
                observer.next(category);
            });
        });
    }

    public RemoveCategory(category: Category): Observable<any> {        
        return Observable.create(observer => {
            this.angularFireDatabase.object(CloudStorageKey.KEY_CATEGORIES + '/' + category.id).remove().then(data => {
                observer.next(category);
            });
        });
    }

    public UpdateCategory(category: Category) {
        this.angularFireDatabase.list(CloudStorageKey.KEY_CATEGORIES).update(category.id, category);
    }

    public RetrieveCategories(): FirebaseListObservable<any[]> {
        return this.angularFireDatabase.list(CloudStorageKey.KEY_CATEGORIES, { preserveSnapshot: true});
    }
}
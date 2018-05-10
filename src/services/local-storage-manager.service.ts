import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Person } from '../data-classes/person';
import { Attendance } from '../data-classes/attendance';

export class LocalStorageKey {
    public static KEY_PERSONS = "persons";
    public static KEY_ATTENDANCES = "attendances";
}

@Injectable()
export class LocalStorageManagerService {

    constructor(
        private storage: Storage
    ) {

    }

    public SavePersons(persons: Person[]) {
        this.storage.set(LocalStorageKey.KEY_PERSONS, persons); 
    }

    public SaveAttendances(attendances: Attendance[]) {
        this.storage.set(LocalStorageKey.KEY_ATTENDANCES, attendances); 
    }

    public RetrieveAttendances(): Promise<any> {
        return this.storage.get(LocalStorageKey.KEY_ATTENDANCES);
    }

    public RetrievePersons(): Promise<any> {
        return this.storage.get(LocalStorageKey.KEY_PERSONS);
    }
}
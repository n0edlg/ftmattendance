import { Person } from './person';
import { ISO8601Util } from './ISO8601Util';

export class Member extends Person {  
    id: any;
    isPresent?: boolean;
    groups: any[];
    tpoints?: number;

    constructor() {
        super();
    }

    public static fromJson(jsonObject: any): Member {
        let retVal: Member = new Member();

        retVal.id = jsonObject.id;
        retVal.groups = jsonObject.groups;
        retVal.tpoints = jsonObject.tpoints == null ? 0 : jsonObject.tpoints;
        retVal.firstname = jsonObject.firstname;
        retVal.middlename = jsonObject.middlename;
        retVal.lastname = jsonObject.lastname;
        retVal.nickname = jsonObject.nickname == null ? jsonObject.firstname : jsonObject.nickname;        
        retVal.birthdate = (jsonObject.birthdate != null && jsonObject.birthdate != '') ? new Date(jsonObject.birthdate) : null;
        retVal.gender = jsonObject.gender;

        if (retVal.birthdate != null) {
            retVal.age = Math.floor(((Date.now() - retVal.birthdate.getTime()) / (1000 * 3600 * 24)) / 365);
        }
        else {
            retVal.age = 0;
        }

        return retVal;
    }

    public toJson(): any {
        let obj: any = super.toJson();

        if (this.id != null) {
            obj.id = this.id;
        }

        if (this.groups != null) {
            obj.groups = this.groups;
        }

        if (this.tpoints != null) {
            obj.tpoints = this.tpoints;
        }        

        return obj;
    }
}

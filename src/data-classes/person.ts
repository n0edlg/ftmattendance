export class Person {
    firstname: string;
    middlename: string;
    lastname: string;
    nickname: string;
    birthdate: Date;
    age: number;
    gender: string;

    constructor() {
        
    }

    public toJson(): any {
        let obj: any = {};

        if (this.firstname != null) {
            obj.firstname = this.firstname;
        }

        if (this.lastname != null) {
            obj.lastname = this.lastname;
        }

        if (this.middlename != null) {
            obj.middlename = this.middlename;
        }

        if (this.nickname != null) {
            obj.nickname = this.nickname;
        }

        if (this.birthdate != null) {
            obj.birthdate = this.birthdate.toISOString();
        }

        if (this.gender != null) {
            obj.gender = this.gender;
        }

        return obj;
    }
}

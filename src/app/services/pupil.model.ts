export class Pupil {
    id: string;
    firstName: string;
    lastName: string;
    picture: string;
    getFullName(): string {
        return this.firstName + ' ' + this.lastName;
    }
    accessCode: string;
}
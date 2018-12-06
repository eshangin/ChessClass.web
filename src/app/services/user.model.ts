export enum Role {
    Teacher = 1,
    Pupil
}

export class User {
    id: string;
    firstName: string;
    lastName: string;
    getFullName(): string {
        return this.firstName + ' ' + this.lastName;
    };
    role: Role;
}
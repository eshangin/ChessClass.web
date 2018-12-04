export enum Role {
    Teacher = 1,
    Pupil
}

export class User {
    id: string;
    name: string;
    role: Role;
}
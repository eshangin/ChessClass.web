import { User, Role } from "./user.model";

export class Pupil extends User {
    constructor() {
        super();
        this.role = Role.Pupil;
    }

    picture: string;
    accessCode: string;
}
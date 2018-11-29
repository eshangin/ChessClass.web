import {Pupil} from "./pupil.model";

export class SchoolClass {
    id: string;
    name: string;
    pupils: Pupil[] = [];
}
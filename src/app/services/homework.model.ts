import {Puzzle} from "./puzzle.model";

export class Homework {
    id: string;
    puzzles: Puzzle[];
    classId: string;
    dateCreated: Date;
}
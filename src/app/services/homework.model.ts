import {Puzzle} from "./puzzle.model";

export class Homework {
    id: string;
    puzzles: Puzzle[];
    pupilId: string;
    dateCreated: Date;
}
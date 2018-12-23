export enum PuzzleType {
    Standard = 1,
    FindAllChecks
}

export class Puzzle {
    id: string;
    puzzleType: PuzzleType;
    pgn?: string;
    fen?: string;
    isFavorite: boolean;
    description: string;
    createdById?: string;
    dateCreated: Date;
}

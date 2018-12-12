import { User } from "./user.model";

export class ChatMessage {
    id: string;
    dateCreated: Date;
    text: string;
    from: User;
}

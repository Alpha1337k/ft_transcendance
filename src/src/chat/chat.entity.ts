import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export class ChatMessage {
	sendDate	: Date;
	message 	: string;
	userId		: string;
	constructor(msg : string, id : string) {
		this.sendDate = new Date();
		this.message = msg;
		this.userId = id;
	}
}

@Entity()
export class ChatEntity {

	@PrimaryGeneratedColumn()
	chatid: string;

	@Column()
	messages: ChatMessage[]
}
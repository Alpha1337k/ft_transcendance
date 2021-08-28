import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export class ChatMessage {
	sendDate	: Date;
	message 	: string;
	userId		: number;
	constructor(msg : string, id : number) {
		this.sendDate = new Date();
		this.message = msg;
		this.userId = id;
	}
}

@Entity()
export class ChatEntity {

	@PrimaryGeneratedColumn()
	chatid: string;

	@Column('simple-array', {nullable: true})
	usernames: string[];

	@Column()
	messages: string;
}
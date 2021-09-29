import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChatEntity {
	@PrimaryGeneratedColumn()
	chatid: string;

	@Column()
	private: boolean;

	@Column('simple-array', { nullable: true })
	usernames: string[];

	@OneToMany(() => ChatMessage, (messages) => messages.chat, { eager: true })
	messages: ChatMessage[];
}

@Entity()
export class ChatMessage {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column()
	message: string;

	@Column()
	sender: string;

	@Column()
	sendDate: Date;

	@ManyToOne(() => ChatEntity, (chat) => chat.messages)
	@JoinColumn()
	chat: ChatEntity;

	constructor(msg: string, chat: ChatEntity) {
		this.sendDate = new Date();
		this.message = msg;
		this.sender = 'xd';
		this.chat = chat;
	}
}

/*  * -*  *- *- *- *- *- *- * * ** -* -* -* - *- *- *-* - ** - *- - * *-   */
/*  *       _                                 _                        +\  */
/*   -     | |_ ___ ___ ___ ___ ___ ___ ___ _| |___ ___ ___ ___       +    */
/*   +     |  _|  _| .'|   |_ -|  _| -_|   | . | -_|   |  _| -_|       /*  */
/*  *      |_| |_| |__,|_|_|___|___|___|_|_|___|___|_|_|___|___|         + */
/*  -       ~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~        *  */
/*  *       Oscar Kruithof   |   okruitho    |   Alpha_1337k           *-  */
/*  -*      Robijn van Houts |   rvan-hou    |   robijnvh             -+   */
/*  * /   Jonas Bennink Bolt |   jbennink    |   JonasDBB            /-    */
/*  /       Tim van Citters  |   tvan-cit    |   Tjobo-Hero           *    */
/*   +      Rene Braaksma    |   rbraaksm    |   rbraaksm              -   */
/*    *.                                                              ._   */
/*   *.   chat.entity.ts           | Created: 2021-10-06 17:48:04    ._    */
/*  -     Edited on 2021-10-06 17:48:04 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
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

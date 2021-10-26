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
/*   *.   user.entity.ts           | Created: 2021-10-06 17:48:04    ._    */
/*  -     Edited on 2021-10-06 17:48:04 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Match } from '../match/match.entity';

export enum UserRank {
	SPLUS = 'S+',
	S = 'S',
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D',
}

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn('increment')
	userid: number;

	@Column()
	name: string;

	@Column()
	imageUrl: string;

	@Column({ default: 0 })
	wins: number;

	@Column({ default: 0 })
	losses: number;

	@Column()
	lastSeen: Date;

	@ManyToMany(() => Match, (match) => match.players, { onUpdate: 'CASCADE' })
	@JoinTable()
	history: Match[];

	@ManyToMany(() => UserEntity, { onDelete: `SET NULL`, cascade: true })
	@JoinTable()
	friends: UserEntity[];

	@Column({ default: 800 })
	userElo: number;

	@Column({ type: 'enum', enum: UserRank, default: UserRank.C })
	UserRank: UserRank;

	@Column({ nullable: true })
	twoFactorSecret: string;
}

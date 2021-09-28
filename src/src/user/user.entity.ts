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
	image: string;

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

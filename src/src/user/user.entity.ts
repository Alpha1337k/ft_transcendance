import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRank {
	SPLUS = 'S+',
	S = 'S',
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D'
}

export class concludedMatch {
	p1 : UserEntity;
	p2 : UserEntity;
	p1Score: number;
	p2Score: number;
	constructor(p1: UserEntity, p2:UserEntity, p1Score:number, p2Score: number) {
		this.p1 = p1;
		this.p2 = p2;
		this.p1Score = p1Score;
		this.p2Score = p2Score;
	}
}

@Entity()
export class UserEntity {

	@PrimaryGeneratedColumn()
	userid: string;

	@Column()
	name: string;

	@Column()
	image: string;

	@Column({default: 0})
	wins: number;

	@Column({default: 0})
	losses: number;

	@Column()
	lastSeen: Date;

	@Column('simple-array', {nullable: true})
	history: concludedMatch[];

	@Column({default: 800})
	userElo: number;

	@Column({type: "enum", enum: UserRank, default: UserRank.C})
	UserRank: UserRank;

	@Column({nullable: true})
	twoFactorSecret: string;
}

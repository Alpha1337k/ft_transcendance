import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRank {
	SPLUS = 'S+',
	S = 'S',
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D'
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

	//@Column([{default: 800}])
	//elo: number;

	@Column({type: "enum", enum: UserRank, default: UserRank.C})
	UserRank: UserRank;

}

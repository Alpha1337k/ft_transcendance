import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

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

	@PrimaryGeneratedColumn("increment")
	userid: number;

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

	@ManyToMany(() => ConcludedMatch, history => history.players, {cascade: true})
	@JoinTable()
	history: ConcludedMatch[];

	@Column({default: 800})
	userElo: number;

	@Column({type: "enum", enum: UserRank, default: UserRank.C})
	UserRank: UserRank;

	@Column({nullable: true})
	twoFactorSecret: string;

    @ManyToMany(() => UserEntity, {cascade: true})
    @JoinTable()
    friends: UserEntity[];

	addFriend(user : UserEntity) {
		if (this.history == null)
			this.friends = new Array<UserEntity>();
		this.friends.push(user);
	}

	addMatch(match : ConcludedMatch) {
		if (this.history == null)
			this.history = new Array<ConcludedMatch>();
		this.history.push(match);
	}
}

@Entity()
export class ConcludedMatch {
	@PrimaryGeneratedColumn("increment")
	matchid: number;

	@ManyToMany(() => UserEntity, players => players.history)
	players: UserEntity;
	
	@Column()
	p1Score: number;
	
	@Column()
	p2Score: number;

}
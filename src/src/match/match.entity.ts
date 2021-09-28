import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity()
export class Match {
	@PrimaryGeneratedColumn('increment')
	matchid: number;

	@ManyToMany(() => UserEntity, (player) => player.history)
	players: UserEntity[];

	@Column()
	p1Score: number;

	@Column()
	p2Score: number;

	@Column()
	p1Elo: number;

	@Column()
	p2Elo: number;
}

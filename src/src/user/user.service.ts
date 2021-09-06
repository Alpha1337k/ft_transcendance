import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConcludedMatch, UserEntity } from './user.entity';
import { generateAvatar } from 'src/modules/generateAvatar/generateAvatar';


@Injectable()
export class UserService {

	constructor (
		@Inject('USER_REPOSITORY')
		private UserRepository: Repository<UserEntity>,
	) {}

	async getAllUsers(): Promise<UserEntity[]> {
		return await this.UserRepository.find();
	}

	async createHistory() {
		const p1 = await this.UserRepository.findOne({userid: 1});
		const p2 = await this.UserRepository.findOne({userid: 1});
	
		for (let i = 0; i < 1; i++)
		{
			const game = new ConcludedMatch();

			game.p1Score = 7;
			game.p2Score = 1;

			p1.addMatch(game);
		}
		console.log(p1.history);
		await this.UserRepository.save(p1);
		const p3 = await this.UserRepository.findOne({userid: 1});
		console.log("Now.. the history!", p3.history);
	}

	async addUserRandom(): Promise<void> {
		let user = new UserEntity();
		user.lastSeen = new Date();
		user.name = "jeff";
		user.image = (await generateAvatar()).toString('base64');

		await this.UserRepository.manager.save(user).then(()=> {console.log("---- saved a img!")});
		this.createHistory();
	}

	async getUserById(id : number): Promise<UserEntity> {
		return this.UserRepository.findOne(id);
	}

	async getUserByVarId(id : number, obj : Object): Promise<any> {
		return this.UserRepository.findOne(id, obj);
	}

	async updateUser(user : UserEntity) {
		this.UserRepository.manager.save(user);
	}
}
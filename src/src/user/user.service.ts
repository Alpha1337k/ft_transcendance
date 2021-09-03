import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
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

	async addUserRandom(): Promise<void> {
		let user = new UserEntity();
		user.lastSeen = new Date();
		user.name = "jeff";
		user.image = (await generateAvatar()).toString('base64');

		this.UserRepository.manager.save(user).then(()=> {console.log("---- saved a img!")});
	}

	async getUserById(id : number): Promise<UserEntity> {
		return this.UserRepository.findOne(id);
	}

	async updateUser(user : UserEntity) {
		this.UserRepository.manager.save(user);
	}
}
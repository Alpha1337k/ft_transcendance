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

	async getAllUsers(): Promise<string> {
		return "haha" + JSON.stringify(await this.UserRepository.find());
	}

	async addUserRandom(): Promise<void> {
		let user = new UserEntity();
		user.lastSeen = new Date();
		user.name = "jeff";
		user.image = (generateAvatar()).toString();

		this.UserRepository.manager.save(user).then(()=> {console.log("---- saved a img!")});
	}
}
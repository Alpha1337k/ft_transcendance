import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { generateAvatar } from 'src/modules/generateAvatar/generateAvatar';
import { Match } from '../match/match.entity';

@Injectable()
export class UserService {
	constructor(
		@Inject('USER_REPOSITORY')
		private UserRepository: Repository<UserEntity>
	) {}

	async getAllUsers(): Promise<UserEntity[]> {
		return await this.UserRepository.find();
	}

	async addUserRandom(): Promise<UserEntity> {
		const user = new UserEntity();
		user.lastSeen = new Date();
		user.name = 'jeff';
		user.image = '';
		// user.image = (await generateAvatar()).toString('base64');
		if (user.userid > 1) await this.addFriend(user.userid, 1);
		return this.UserRepository.manager.save(user);
	}

	async addUser(name: string): Promise<void> {
		const user = new UserEntity();
		user.lastSeen = new Date();
		user.name = name;
		user.image = '';
		// user.image = (await generateAvatar()).toString('base64');
		await this.UserRepository.manager.save(user);
	}

	async getUserById(id: number): Promise<UserEntity> {
		try {
			return this.UserRepository.findOneOrFail(id);
		} catch (err) {
			throw err;
		}
	}

	async getUserByVarId(id: number, obj: any): Promise<any> {
		return this.UserRepository.findOne(id, obj);
	}

	async getUserHistory(id: number): Promise<Match[]> {
		const user = await this.UserRepository.findOne(id, {
			relations: ['history'],
		});
		return user.history;
	}

	async getUserWithFriends(id: number): Promise<UserEntity> {
		return this.UserRepository.findOne(id, {
			relations: ['friends'],
		});
	}

	async getFriends(userId: number): Promise<UserEntity[]> {
		const user = await this.getUserWithFriends(userId);
		return user.friends;
	}

	async addFriend(userId: number, friendId: number) {
		if (userId == friendId) return;
		const user = await this.getUserWithFriends(userId);
		console.log(user);
		console.log(user.friends);
		if (user.friends.find((x) => x.userid == friendId)) {
			console.log('already friends');
			return;
		}
		const friend = await this.getUserById(friendId);
		if (user.friends == null) user.friends = [friend];
		else user.friends.push(friend);
		return this.UserRepository.save(user);
	}

	async deleteFriend(userId: number, friendId: number) {
		const user = await this.getUserWithFriends(userId);
		user.friends = user.friends.filter((user) => {
			user.userid !== friendId;
		});
		await this.UserRepository.save(user);
	}

	async updateUser(user: UserEntity) {
		await this.UserRepository.manager.save(user);
	}
}

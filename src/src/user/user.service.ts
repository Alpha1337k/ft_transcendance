import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity, UserRank } from './user.entity';
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
		user.friends = [];
		// user.image = (await generateAvatar()).toString('base64');
		if (user.userid > 1) await this.addFriend(user.userid, 1);
		return this.UserRepository.manager.save(user);
	}

	async addUser(name: string): Promise<void> {
		const user = new UserEntity();
		user.lastSeen = new Date();
		user.name = name;
		user.image = '';
		user.friends = [];
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

	// match functions
	async getUserHistory(id: number): Promise<Match[]> {
		const user = await this.UserRepository.findOne(id, {
			relations: ['history'],
		});
		return user.history;
	}

	async updateElo(id: number, won: boolean, opponentElo: number) {
		// make thes available somewhere else
		const multi = 400;
		const kFactor = 32;

		const user = await this.UserRepository.findOne(id);
		const Q1 = Math.pow(10, user.userElo / multi);
		const Q2 = Math.pow(10, opponentElo / multi);
		const E1 = Q1 / (Q1 + Q2);
		let wonGame;
		if (won) {
			++user.wins;
			wonGame = 1;
		} else {
			++user.losses;
			wonGame = 0;
		}
		user.userElo = Math.round(user.userElo + kFactor * (wonGame - E1));
		if (user.userElo < 500) user.UserRank = UserRank.D;
		if (user.userElo >= 500 && user.userElo < 1000) user.UserRank = UserRank.C;
		if (user.userElo >= 1000 && user.userElo < 1500) user.UserRank = UserRank.B;
		if (user.userElo >= 1500 && user.userElo < 2000) user.UserRank = UserRank.A;
		if (user.userElo >= 2000 && user.userElo < 2500) user.UserRank = UserRank.S;
		if (user.userElo >= 2500) user.UserRank = UserRank.SPLUS;
		return this.UserRepository.save(user);
	}

	// friend functions
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
		if (userId == friendId) throw "can't add yourself";
		const user = await this.getUserWithFriends(userId);
		if (user.friends.find((x) => x.userid == friendId)) {
			throw 'already friends';
		}
		const friend = await this.getUserById(friendId);
		user.friends.push(friend);
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

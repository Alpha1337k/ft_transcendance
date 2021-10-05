import { Injectable } from '@nestjs/common';
import { UserEntity } from './user/user.entity';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
	constructor(private readonly userService: UserService) {}

}

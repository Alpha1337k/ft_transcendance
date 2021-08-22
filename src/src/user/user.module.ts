import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProvider } from './user.provider';

@Module({
	imports: [
		DatabaseModule
	],
	controllers: [
		UserController
	],
	providers: [UserService, ...UserProvider]
})
export class UserModule {}

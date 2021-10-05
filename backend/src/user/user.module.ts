import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProvider } from './user.provider';
import { ImageModule } from 'src/image/image.module';

@Module({
	imports: [DatabaseModule, ImageModule],
	controllers: [UserController],
	providers: [UserService, ...UserProvider],
	exports: [UserService, ...UserProvider],
})
export class UserModule {}

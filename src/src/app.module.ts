import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { FriendsModule } from './front/friends/friends.module';
import { ProfileModule } from './front/profile/profile.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: 'codam',
			database: 'test',
			entities: [],
			autoLoadEntities: true,
			synchronize: true,
		}),
		UserModule,
		FriendsModule,
		ProfileModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

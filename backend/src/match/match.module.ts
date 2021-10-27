import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MatchService } from './match.service';
import { MatchProvider } from './match.provider';
import { UserModule } from 'src/user/user.module';
import { MatchController } from './match.controller';

@Module({
	imports: [DatabaseModule, UserModule],
	providers: [MatchService, ...MatchProvider],
	exports: [MatchService],
	controllers: [MatchController],
})
export class MatchModule {}

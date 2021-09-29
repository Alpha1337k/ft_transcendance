import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MatchService } from './match.service';

@Module({
	imports: [DatabaseModule],
	providers: [MatchService],
	exports: [MatchService],
})
export class MatchModule {}

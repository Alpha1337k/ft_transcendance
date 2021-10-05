import { Module } from '@nestjs/common';
import { ChessController } from './chess.controller';
import { ChessGateway } from './chess.gateway';
import { ChessService } from './chess.service';

@Module({
	imports: [],
	controllers: [ChessController],
	providers: [ChessService, ChessGateway],
})
export class ChessModule {}

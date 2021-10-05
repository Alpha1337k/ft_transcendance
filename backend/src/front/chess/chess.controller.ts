import { Controller, Get, Param } from '@nestjs/common';
import { ChessService } from './chess.service';

@Controller('chess')
export class ChessController {
	constructor(private readonly chessService: ChessService) {}
}

import { Controller, Get, Param } from "@nestjs/common";
import { ChessService } from "./chess.service";

@Controller("chess")
export class ChessController {
	constructor(private readonly chessService : ChessService) {
		
	}
	@Get()
	returnQueue(): string {
		return this.chessService.getQueueScreen();
	}

	@Get(":id")
	returnGame(@Param() params) {
		return this.chessService.getChessScreen(params.id as string);
	}

}
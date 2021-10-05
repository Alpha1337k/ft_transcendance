import { Controller, Get, Param } from '@nestjs/common';
import { PongService } from './pong.service';

@Controller('pong')
export class PongController {
	constructor(private readonly pongService: PongService) {}

	@Get()
	returnQueue(): string {
		return this.pongService.getQueueScreen();
	}

	@Get(':id')
	async returnGame(@Param() params): Promise<string> {
		return await this.pongService.getGameScreen(params.id as string);
	}
}

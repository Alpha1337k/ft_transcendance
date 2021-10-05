import { Controller, Get, Param } from '@nestjs/common';
import { PongService } from './pong.service';

@Controller('pong')
export class PongController {
	constructor(private readonly pongService: PongService) {}
}

import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get(':id')
	async returnChat(@Param() params): Promise<string> {
		return await this.chatService.getChat(params.id);
	}

	@Get('messages/:id')
	async returnMessages(@Param() params): Promise<string> {
		return await this.chatService.getChatMessages(params.id);
	}

	@Get()
	async returnAllChats(): Promise<string> {
		return 'wooooow' + (await this.chatService.getAllChats());
	}
}

import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService, IncomingChatMessage } from './chat.service';
import { Logger } from '@nestjs/common';
import { ChatMessage } from './chat.entity';

@WebSocketGateway({ cors: true }/*  */)
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;
	constructor(private readonly chatService: ChatService) {}

	private logger: Logger = new Logger('ChatGateway');

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Chat::Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Chat::Client connected: ${client.id}`);
	}

	@SubscribeMessage('sendChatMessage')
	async recieveChatMessage(client: Socket, payload: IncomingChatMessage) {
		console.log('message recieved!!!');
		let msg: ChatMessage = await this.chatService.addMessage(payload);
		this.server.emit(
			'msgToClients',
			`<div class="chatmessagebox">
												<h5>${msg.sender}</h5>
												<p>${msg.message}</p>
											</div>`
		);
	}
}

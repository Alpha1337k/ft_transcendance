import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { PongService, positionUpdate } from './pong.service';

@WebSocketGateway({ cors: true })
export class PongGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;

	constructor(private readonly appService: PongService) {
	}

	private logger: Logger = new Logger('PongGateway');

	@SubscribeMessage('sendClientUpdate')
	handleUpdate(
		client: Socket,
		payload: { id: string; updt: positionUpdate }
	): void {
		// console.log('Update!:', payload);
		this.appService.updateGame(payload);
	}

	@SubscribeMessage('getGameData')
	handleData(client: Socket, payload: string) {
		// console.log('GameData!:', payload);
		this.server
			.to(client.id)
			.emit('getGameData', this.appService.getGameData(payload));
	}

	@SubscribeMessage('findGame')
	findGame(client: Socket, payload: string | any) {
		this.appService.addToQueue(client, this.server);
	}

	afterInit(server: Server) {
		this.logger.log('Init');
		this.appService.sendQueueUpdates(this.server);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}
}

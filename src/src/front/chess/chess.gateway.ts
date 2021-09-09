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
import { ChessService } from './chess.service';

@WebSocketGateway()
export class ChessGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	constructor(private readonly chessService : ChessService) {}

	private logger: Logger = new Logger('ChessGateway');

	@SubscribeMessage('requestChessGameData')
	handleData(client: Socket, payload: string) {
		console.log("GameData!:", payload);
		this.server.to(client.id).emit("getChessGameData", this.chessService.getGameData(client, payload));
	}

	@SubscribeMessage('sendChessMove')
	handleMove(client: Socket, payload: object) {
		this.chessService.checkMove(client, payload);
	}


	@SubscribeMessage('findChessGame')
	findGame(client: Socket, payload : string | any) {
		this.chessService.addToQueue(client, this.server);
	}

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}
}
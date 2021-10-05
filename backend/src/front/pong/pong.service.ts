import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UserService } from 'src/user/user.service';

class vec_2 {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

class line {
	p1: vec_2;
	p2: vec_2;
	constructor(p1: vec_2, p2: vec_2) {
		this.p1 = p1;
		this.p2 = p2;
	}
}

class gameUpdate {
	ballPos: vec_2;
	p1_pos: vec_2;
	p2_pos: vec_2;
	constructor(game: Game) {
		this.ballPos = game.ballPos;
		this.p1_pos = game.p1_pos;
		this.p2_pos = game.p2_pos;
	}
}

export class positionUpdate {
	id: number;
	newpos: vec_2;
}

function ccw(
	A: { y: number; x: number },
	B: { x: number; y: number },
	C: { y: number; x: number }
) {
	return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
}

function intersect(p1: vec_2, p2: vec_2, p3: vec_2, p4: vec_2) {
	return (
		ccw(p1, p3, p4) != ccw(p2, p3, p4) && ccw(p1, p2, p3) != ccw(p1, p2, p4)
	);
}

class Game {
	walls: line[] = [];
	ballPos: vec_2;
	ballDir: vec_2;
	ballAng: number;
	ballSpeed: number;
	ballExists: boolean = false;

	p1_pos: vec_2;
	p2_pos: vec_2;
	p1_score: number = 0;
	p2_score: number = 0;
	maxScore: number = 7;

	gameEnded: boolean = false;

	#deltaTime: number;
	#lastTime: number;

	#serverRef: Server;
	roomId: string;
	inter: NodeJS.Timeout;

	constructor(server: Server, roomid: string) {
		this.#serverRef = server;
		this.roomId = roomid;
		this.walls.push(new line(new vec_2(5, 5), new vec_2(5, 145)));
		this.walls.push(new line(new vec_2(95, 5), new vec_2(95, 145)));
		this.p1_pos = new vec_2(45, 5);
		this.p2_pos = new vec_2(45, 145);
		this.ballPos = new vec_2(50, 75);

		this.run_game();
	}

	async run_game() {
		await new Promise((resolve) => setTimeout(resolve, 5000));

		const gameRef = this;
		this.inter = setInterval(function () {
			if (gameRef.gameEnded) {
				// console.log('ending interval!');
				clearInterval(gameRef.inter);
				gameRef.#serverRef.to(gameRef.roomId).emit('gameFinished', '');
				return;
			}
			gameRef.update_game();
			gameRef.#serverRef
				.to(gameRef.roomId)
				.emit('getGameUpdate', new gameUpdate(gameRef));
		}, 1000 / 60);
	}

	update_position(updt: positionUpdate) {
		if (updt.id === 1) {
			if (updt.newpos.x < 5) this.p1_pos.x = 5;
			else if (updt.newpos.x > 85) this.p1_pos.x = 85;
			else this.p1_pos.x = updt.newpos.x;
		} else if (updt.id === 2) {
			if (updt.newpos.x < 5) this.p2_pos.x = 5;
			else if (updt.newpos.x > 85) this.p2_pos.x = 85;
			else this.p2_pos.x = updt.newpos.x;
		}
		else
		{
			console.log("wat de kanker is dit?????");
		}
	}

	update_game() {
		this.#deltaTime = (Date.now() - this.#lastTime) / 1000;
		this.#lastTime = Date.now();

		if (this.ballExists == false) {
			this.ballSpeed = 40;
			this.ballAng = Math.random() * 45 + 45;
			if (Math.random() > 0.5) this.ballAng += 180;
			this.ballDir = new vec_2(
				Math.cos(this.ballAng * 0.0174532925),
				Math.sin(this.ballAng * 0.0174532925)
			);
			this.ballPos = new vec_2(50, 75);
			this.ballExists = true;
		} else {
			let oldpos = new vec_2(this.ballPos.x, this.ballPos.y);
			this.ballPos.x += this.ballDir.x * this.#deltaTime * this.ballSpeed;
			this.ballPos.y -= this.ballDir.y * this.#deltaTime * this.ballSpeed;
			for (let index = 0; index < this.walls.length; index++) {
				const element = this.walls[index];
				if (intersect(oldpos, this.ballPos, element.p1, element.p2)) {
					// console.log('collission with wall!!');
					this.ballSpeed *= 1.1;
					if (element.p1.y < element.p2.y) this.ballDir.x = -this.ballDir.x;
					else this.ballDir.y = -this.ballDir.y;
					this.ballPos.x += this.ballDir.x * this.#deltaTime * this.ballSpeed;
					this.ballPos.y -= this.ballDir.y * this.#deltaTime * this.ballSpeed;
					break;
				}
			}
			let player1_end: vec_2 = new vec_2(this.p1_pos.x + 10, this.p1_pos.y + 5);
			let player2_end: vec_2 = new vec_2(this.p2_pos.x + 10, this.p2_pos.y);
			if (
				intersect(oldpos, this.ballPos, this.p1_pos, player1_end) ||
				intersect(oldpos, this.ballPos, this.p2_pos, player2_end)
			) {
				this.ballSpeed *= 1.1;
				// console.log('COLLISSION!!');
				this.ballDir.y = -this.ballDir.y;
				this.ballPos.x += this.ballDir.x * this.#deltaTime * this.ballSpeed;
				this.ballPos.y -= this.ballDir.y * this.#deltaTime * this.ballSpeed;
			}
			if (this.ballPos.y < 0) {
				console.log('good job! p2');
				this.ballExists = false;
				this.p2_score++;
				this.#serverRef
					.to(this.roomId)
					.emit('getScoreUpdate', { id: 1, value: this.p2_score });
				if (this.p2_score >= this.maxScore) {
					console.log('Wow! p2 won!!!!!');
					this.gameEnded = true;
				}
			} else if (this.ballPos.y > 150) {
				console.log('good job! p1');
				this.ballExists = false;
				this.p1_score++;
				this.#serverRef
					.to(this.roomId)
					.emit('getScoreUpdate', { id: 0, value: this.p1_score });
				if (this.p1_score >= this.maxScore) {
					console.log('Wow! p1 won!!!!!');
					this.gameEnded = true;
				}
			}
		}
	}
}

@Injectable()
export class PongService {
	constructor(private readonly userService: UserService) {}

	running_games = new Map<string, Game>();
	gameid: string = 'a';
	searching_players: Socket[] = [];

	async sendQueueUpdates(server: Server)
	{
		setInterval(() => {
			server.emit("QueueUpdate", Math.round(Math.random() * 1000));
		}, 30000);
	}

	getGameData(searchId: string): Game {
		const game = this.running_games[searchId];
		// console.log(game);
		return game;
	}

	updateGame(updt: { id: string; updt: positionUpdate }): void {
		const game = this.running_games[updt.id];

		if (game == null) return;
		game.update_position(updt.updt);
		console.log("p1_pos:", game.p1_pos.x, game.p2_pos.x, updt);
	}

	addToQueue(clientid: Socket, server: Server): void {
		this.searching_players.push(clientid);
		if (this.searching_players.length >= 2) {
			const p1 = this.searching_players.pop();
			const p2 = this.searching_players.pop();
			this.running_games[this.gameid] = new Game(server, this.gameid);

			server.to(p1.id).emit('gameFound', { gameId: this.gameid, userId: 1 });
			server.to(p2.id).emit('gameFound', { gameId: this.gameid, userId: 2 });
			p1.join(this.gameid);
			p2.join(this.gameid);

			// a -> b -> c etc k
			this.gameid = String.fromCharCode(this.gameid.charCodeAt(0) + 1);
		}
	}
	removeFromQueue(clientid: Socket): void {
		const idx = this.searching_players.findIndex(x => x.id === clientid.id);
		this.searching_players.splice(idx, 1);
	}
}

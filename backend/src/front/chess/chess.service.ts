import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@Injectable()
export class ChessService {
	running_games = new Map<string, ChessGame>();
	gameid: string = 'a';
	searching_players: Socket[] = [];
	checkInterval: NodeJS.Timer;
	constructor() {
		this.checkStaleGames();
	}

	async checkStaleGames() {
		this.checkInterval = setInterval(() => {
			this.running_games.forEach(function (value, key) {
				console.log('checking game', key);
				if (value.checkGameOver()) {
					console.log('Deleted stale game!');
					this.running_games.delete(key);
				}
			});
		}, 2000);
	}

	addToQueue(clientid: Socket, server: Server): void {
		this.searching_players.push(clientid);
		if (this.searching_players.length >= 2) {
			let p1 = this.searching_players.pop();
			let p2 = this.searching_players.pop();
			this.running_games[this.gameid] = new ChessGame(
				p1,
				p2,
				300,
				this.gameid,
				server
			);

			server
				.to(p1.id)
				.emit('chessGameFound', {
					gameId: this.gameid,
					userId: 1,
					color: true,
					game: this.running_games[this.gameid],
				});
			server
				.to(p2.id)
				.emit('chessGameFound', {
					gameId: this.gameid,
					userId: 2,
					color: false,
					game: this.running_games[this.gameid],
				});
			p1.join(this.gameid);
			p2.join(this.gameid);

			// a -> b -> c etc k
			this.gameid = String.fromCharCode(this.gameid.charCodeAt(0) + 1);
		}
	}

	checkMove(client: Socket, data: any) {
		const game: ChessGame = this.running_games[data.gameid];

		game.is_allowed(client, data.oldpos, data.newpos);
	}

	getGameData(user: Socket, id: string) {
		return this.running_games[id].getGameData(user);
	}

	removeFromQueue(clientid: Socket): void {
		const idx = this.searching_players.findIndex(x => x.id === clientid.id);
		this.searching_players.splice(idx, 1);
	}
}

class ChessGame {
	#board = Array<string>(64);
	#players: Socket[] = [];
	#serverRef: Server;

	#initTime: number;

	fen: string;

	move: number;

	firstTurn: boolean[] = [true, true];
	playerTurn: number[] = [0, 0];
	playerTime: number[] = Array<number>(2);
	turnStart: number;

	p1_castle: boolean[] = [true, true];
	p2_castle: boolean[] = [true, true];

	oldpos: number;
	newpos: number;

	roomId: string;
	whiteMove: boolean;

	constructor(
		p1: Socket,
		p2: Socket,
		time: number,
		id: string,
		server: Server
	) {
		this.roomId = id;
		this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
		this.whiteMove = true;
		this.#players.push(p1);
		this.#players.push(p2);
		this.playerTime[0] = time;
		this.playerTime[1] = time;

		this.#initTime = Date.now();

		this.#serverRef = server;

		for (
			let pos = 0, index = 0;
			index < this.fen.length && this.fen[index] != ' ';
			index++
		) {
			const e = this.fen[index];
			if (e == '/') continue;
			if (e > '0' && e < '9') pos += e.charCodeAt(0) - 48;
			else {
				this.#board[pos] = e;
				pos++;
			}
		}
		//console.log(this.#board);
	}

	getGameData(user: Socket): any {
		return {
			gameId: this.roomId,
			userId: this.#players[0].id == user.id ? 0 : 1,
			game: this,
		};
	}

	checkGameOver() {
		if (this.move < 2 && (Date.now() - this.#initTime) / 1000 > 30) {
			console.log('game aborted');
			return true;
		} else if (
			this.playerTime[this.whiteMove ? 1 : 0] -
				(Date.now() - this.turnStart) / 1000 <
			0
		)
			return true;
		return false;
	}

	turnUpdate() {
		if (this.firstTurn[this.whiteMove ? 1 : 0] == true) {
			this.firstTurn[this.whiteMove ? 1 : 0] = false;
		} else {
			this.playerTime[this.whiteMove ? 1 : 0] -=
				(Date.now() - this.turnStart) / 1000;
			console.log(
				'new time for player',
				this.whiteMove,
				this.playerTime[this.whiteMove ? 1 : 0]
			);
		}
		this.whiteMove = !this.whiteMove;
		this.turnStart = Date.now();
		this.move++;
	}

	is_allowed(client: Socket, oldpos: number, newpos: number) {
		console.log('---Recieved a new move!', oldpos, newpos);

		let piece_type: string = this.#board[oldpos];
		let color: boolean = piece_type.toLowerCase() == piece_type; // white = true
		let possible: boolean = false;
		let iscastle: { possible: boolean; oldpos: number; newpos: number };
		let checked: boolean = false;

		piece_type = piece_type.toLowerCase();
		console.log('Move data: ', piece_type, color, newpos, oldpos);
		switch (piece_type) {
			case 'p':
				possible = this.check_pawn(color, newpos, oldpos);
				break;
			case 'r':
				possible = this.check_rook(color, newpos, oldpos);
				break;
			case 'k':
				possible = this.check_king(color, newpos, oldpos);
				break;
			case 'q':
				possible = this.check_queen(color, newpos, oldpos);
				break;
			case 'b':
				possible = this.check_bishop(color, newpos, oldpos);
				break;
			case 'n':
				possible = this.check_knight(color, newpos, oldpos);
				break;
		}
		if (piece_type == 'k' && !possible)
			iscastle = this.check_castle(color, newpos, oldpos);
		if (possible) possible = this.check_take(newpos, oldpos, color, piece_type);
		if (possible || iscastle) {
			console.log('The move is possible! ', oldpos, newpos);
			let tmp = this.#board[newpos];
			this.#board[newpos] = this.#board[oldpos];
			this.#board[oldpos] = undefined;

			if (this.check_checked(color, undefined)) {
				console.log('The move is checked! ', oldpos, newpos, checked);
				this.#serverRef
					.to(client.id)
					.emit('revertMove', { oldpos, newpos, checked: true });
				this.#board[oldpos] = this.#board[newpos];
				this.#board[newpos] = tmp;
				return false;
			}
			if (iscastle) {
				this.#board[newpos] = this.#board[oldpos];
				this.#board[oldpos] = undefined;
			}
			this.update_castles(oldpos, piece_type, color);
			this.turnUpdate();

			if (iscastle)
				this.#serverRef
					.to(this.roomId)
					.emit('moveUpdate', { oldpos, newpos, iscastle, game: this });
			else
				this.#serverRef
					.to(this.roomId)
					.emit('moveUpdate', { oldpos, newpos, game: this });
		} else {
			console.log('The move is invalid! ', oldpos, newpos, checked);
			this.#serverRef
				.to(client.id)
				.emit('revertMove', { oldpos, newpos, checked });
		}
		return possible;
	}

	update_castles(oldpos: number, piece_type: string, color: boolean) {
		if (color == false) {
			if (piece_type == 'r' && oldpos == 56) this.p2_castle[0] = false;
			else if (piece_type == 'r' && oldpos == 63) this.p2_castle[1] = false;
			else if (piece_type == 'k') {
				this.p2_castle[0] = false;
				this.p2_castle[1] = false;
			}
		} else {
			if (piece_type == 'r' && oldpos == 0) this.p1_castle[0] = false;
			else if (piece_type == 'r' && oldpos == 7) this.p1_castle[1] = false;
			else if (piece_type == 'k') {
				this.p1_castle[0] = false;
				this.p1_castle[1] = false;
			}
		}
	}

	check_rook(color: boolean, newpos: number, oldpos: number) {
		let dir = Array(2);
		if (newpos % 8 == oldpos % 8) {
			if (newpos > oldpos) dir[0] = 1;
			else dir[0] = -1;
			dir[1] = 0;
		} else {
			if (newpos > oldpos) dir[1] = 1;
			else dir[1] = -1;
			dir[0] = 0;
		}
		while (oldpos != newpos && oldpos >= 0 && oldpos <= 63) {
			oldpos += dir[0] * 8 + dir[1];
			if (this.#board[oldpos] != undefined) break;
		}
		if (oldpos == newpos) return true;
		return false;
	}

	check_bishop(color: boolean, newpos: number, oldpos: number) {
		let dir = Array(2);
		if (newpos < oldpos) dir[0] = -1;
		else dir[0] = 1;
		if (newpos % 8 > oldpos % 8) dir[1] = 1;
		else dir[1] = -1;
		while (oldpos != newpos && oldpos >= 0 && oldpos <= 63) {
			oldpos += dir[0] * 8 + dir[1];
			if (this.#board[oldpos] != undefined) break;
		}
		if (oldpos == newpos) return true;
		return false;
	}

	check_pawn(color: boolean, newpos: number, oldpos: number) {
		let tocheck: number;
		if (color == false) tocheck = oldpos - 8;
		else tocheck = oldpos + 8;
		if (newpos == tocheck) return true;

		if (color == true && oldpos >= 8 && oldpos <= 15) tocheck = oldpos + 16;
		else if (color == false && oldpos >= 48 && oldpos <= 55)
			tocheck = oldpos - 16;
		if (newpos == tocheck) return true;

		if (color == true && (newpos == oldpos + 7 || newpos == oldpos + 8))
			return true;
		else if (color == false && (newpos == oldpos - 9 || newpos == oldpos - 7))
			return true;

		return false;
	}

	check_queen(color: boolean, newpos: any, oldpos: any) {
		return (
			this.check_bishop(color, newpos, oldpos) ||
			this.check_rook(color, newpos, oldpos)
		);
	}

	check_castle(color: boolean, newpos: number, oldpos: number) {
		if (color == true && oldpos == 4) {
			if (
				this.p1_castle[0] &&
				newpos == 6 &&
				this.#board[5] == undefined &&
				this.#board[6] == undefined &&
				!this.check_checked(color, 5) &&
				!this.check_checked(color, 6)
			) {
				this.#board[7] = this.#board[5];
				this.#board[7] = undefined;
				return { possible: true, oldpos: 7, newpos: 5 };
			}
			if (
				this.p1_castle[1] &&
				newpos == 2 &&
				this.#board[3] == undefined &&
				this.#board[2] == undefined &&
				this.#board[1] == undefined &&
				!this.check_checked(color, 3) &&
				!this.check_checked(color, 2) &&
				!this.check_checked(color, 1)
			) {
				return { possible: true, oldpos: 0, newpos: 3 };
			}
		} else if (oldpos == 60) {
			if (
				this.p2_castle[0] &&
				newpos == 62 &&
				this.#board[61] == undefined &&
				this.#board[62] == undefined &&
				!this.check_checked(color, 61) &&
				!this.check_checked(color, 62)
			)
				return { possible: true, oldpos: 63, newpos: 61 };
			if (
				this.p2_castle[1] &&
				newpos == 58 &&
				this.#board[57] == undefined &&
				this.#board[58] == undefined &&
				this.#board[59] == undefined &&
				!this.check_checked(color, 59) &&
				!this.check_checked(color, 58) &&
				!this.check_checked(color, 57)
			)
				return { possible: true, oldpos: 56, newpos: 59 };
		}
		console.log('castle is not allowed!', this.p1_castle, this.p2_castle);
		return undefined;
	}

	check_king(color: boolean, newpos: number, oldpos: number) {
		if (
			(newpos >= oldpos - 9 && newpos <= oldpos - 7) ||
			(newpos >= oldpos - 1 && newpos <= oldpos + 1) ||
			(newpos >= oldpos + 7 && newpos <= oldpos + 9)
		) {
			return true;
		}
		return false;
	}

	check_knight(color: boolean, newpos: number, oldpos: number) {
		if (
			newpos == oldpos - 17 ||
			newpos == oldpos - 15 ||
			newpos == oldpos + 17 ||
			newpos == oldpos + 15 ||
			newpos == oldpos + 6 ||
			newpos == oldpos - 6 ||
			newpos == oldpos - 10 ||
			newpos == oldpos + 10
		)
			return true;
		return false;
	}

	check_take(
		newpos: number,
		oldpos: number,
		color: boolean,
		piece_type: string
	) {
		if (piece_type == 'p') {
			if (newpos % 8 == oldpos % 8 && this.#board[newpos] == undefined)
				return true;
			else if (
				this.#board[newpos] == undefined ||
				(this.#board[newpos] == this.#board[newpos].toLowerCase()) == color
			)
				return false;
			return true;
		} else {
			if (this.#board[newpos] == undefined) return true;
			if ((this.#board[newpos] == this.#board[newpos].toLowerCase()) == color)
				return false;
			return true;
		}
	}

	check_row(
		enemies: string[],
		x: number,
		rule: (x: any) => boolean,
		increment: number
	) {
		let start = x;
		for (; rule(x); x += increment) {
			for (let i = 0; i < enemies.length; i++) {
				if (this.#board[x] == enemies[i]) {
					console.log(
						'whoops found an enemy!',
						start,
						x,
						enemies[i],
						increment
					);
					return true;
				}
			}
			if (this.#board[x] != undefined) break;
		}
		return false;
	}

	check_checked(color: boolean, kingPos: number | undefined) {
		const kingValue = color == true ? 'k' : 'K';
		let enemies: string[] = ['q', 'r', 'b', 'k', 'n'];

		for (let x = 0; color == true && x < enemies.length; x++) {
			enemies[x] = enemies[x].toUpperCase();
		}

		let i: number;
		if (kingPos == undefined) i = this.#board.findIndex((x) => x == kingValue);
		else i = kingPos;
		console.log(enemies, kingValue, i);

		console.log('0');

		if (
			this.#board[i - 17] == enemies[4] ||
			this.#board[i - 15] == enemies[4] ||
			this.#board[i + 17] == enemies[4] ||
			this.#board[i + 15] == enemies[4] ||
			this.#board[i - 6] == enemies[4] ||
			this.#board[i + 6] == enemies[4] ||
			this.#board[i - 10] == enemies[4] ||
			this.#board[i + 10] == enemies[4]
		)
			return true;

		enemies.pop();

		console.log('1');

		if (
			this.#board[i - 1] == enemies[3] ||
			this.#board[i + 1] == enemies[3] ||
			this.#board[i - 7] == enemies[3] ||
			this.#board[i - 8] == enemies[3] ||
			this.#board[i - 9] == enemies[3] ||
			this.#board[i + 7] == enemies[3] ||
			this.#board[i + 8] == enemies[3] ||
			this.#board[i + 9] == enemies[3]
		)
			return true;

		enemies.pop();

		console.log('2');

		if (
			this.check_row(enemies, i - 8, (x) => x >= 0, -8) ||
			this.check_row(enemies, i + 8, (x) => x < 64, 8) ||
			this.check_row(enemies, i - 1, (x) => x % 8 != 0, -1) ||
			this.check_row(enemies, i + 1, (x) => x % 8 != 7, 1) ||
			this.check_row(enemies, i - 7, (x) => x >= 0, -7) ||
			this.check_row(enemies, i - 9, (x) => x >= 0, -9) ||
			this.check_row(enemies, i + 7, (x) => x < 64, 7) ||
			this.check_row(enemies, i + 9, (x) => x < 64, 9)
		)
			return true;
		console.log('3');
		if (color && (this.#board[i - 7] == 'p' || this.#board[i - 9] == 'p'))
			return true;
		else if (!color && (this.#board[i + 7] == 'P' || this.#board[i + 9] == 'P'))
			return true;
		console.log('4');
		return false;
	}
}

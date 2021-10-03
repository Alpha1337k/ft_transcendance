import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChesspieceComponent } from '../chesspiece/chesspiece.component';
import { SocketService } from '../socket.service';


function convertPXToVh(px: number) {
	return px * (100 / document.documentElement.clientHeight);
}


class Piece {
	obj: ComponentRef<ChesspieceComponent> | undefined;
	val: string;
	constructor(obj: ComponentRef<ChesspieceComponent> | undefined, val: string, draggable: boolean) {
		this.obj = obj;
		this.val = val;
		if (obj && draggable == true) null;//dragElement(obj);
	}
}

@Component({
	selector: 'app-chess',
	templateUrl: './chess.component.html',
	styleUrls: ['./chess.component.css']
})
export class ChessComponent implements OnInit {
	connections: Subscription[] = [];

	@ViewChild('container', { read: ViewContainerRef })
	boardContainer!: ViewContainerRef;

	playerside: boolean = true;
	board:		Piece[] = Array(64);
	flipped:	number = 1;
	private gameId:	string = '';
	private userId: number = 0;
	private	uniqueid: number = 0;


	constructor(private ws: SocketService, private route: ActivatedRoute, private cfr: ComponentFactoryResolver) { }

	async ngOnInit(): Promise<void> {
		this.connections.push(this.route.params.subscribe(params => {
			this.gameId = params['id'];
			this.userId = parseInt(params['usr']);
		}));
		this.loadfen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0");
	}

	createElem(posT: number, posL: number, img: string, clr: string, selectable: boolean) {

		const factory = this.cfr.resolveComponentFactory(ChesspieceComponent);
		const ref = this.boardContainer.createComponent(factory);
		let style = 'top: ' + posT + 'vh; left: ' + posL + 'vh';

		ref.instance.init(clr + this.uniqueid++, clr, posL + 'vh', posT + 'vh', img, selectable)

		return ref;
	}

	createpiece(type: string, pos: number, selectable: boolean) : ComponentRef<ChesspieceComponent> | undefined
	{
		let posT = Math.floor(pos / 8) * 6.25;
		let posL = (pos % 8) * 6.25;
		switch (type) {
			case 'r':
				return this.createElem(posT, posL, '♖', 'r', selectable);
			case 'k':
				return this.createElem(posT, posL, '♔', 'k', selectable);
			case 'q':
				return this.createElem(posT, posL, '♕', 'q', selectable);
			case 'b':
				return this.createElem(posT, posL, '♗', 'b', selectable);
			case 'n':
				return this.createElem(posT, posL, '♘', 'n', selectable);
			case 'p':
				return this.createElem(posT, posL, '♙', 'p', selectable);
			case 'R':
				return this.createElem(posT, posL, '♜', 'R', selectable);
			case 'K':
				return this.createElem(posT, posL, '♚', 'K', selectable);
			case 'Q':
				return this.createElem(posT, posL, '♛', 'Q', selectable);
			case 'B':
				return this.createElem(posT, posL, '♝', 'B', selectable);
			case 'N':
				return this.createElem(posT, posL, '♞', 'N', selectable);
			case 'P':
				return this.createElem(posT, posL, '♟︎', 'P', selectable);
			default:
				return undefined;
		}
	}

	loadfen(fen: string) {
		let pos = 0;
		for (let index = 0; index < fen.length && fen[index] != ' '; index++) {
			const e = fen[index];
			if (e == '/') continue;
			if (e > '0' && e < '9') pos += e.charCodeAt(0) - '0'.charCodeAt(0);
			else {
				this.board[pos] = new Piece(
					this.createpiece(
						e,
						pos,
						(e == e.toLowerCase()) == this.playerside
					),
					e,
					(e == e.toLowerCase()) == this.playerside
				);
				pos++;
			}
		}
	}
}

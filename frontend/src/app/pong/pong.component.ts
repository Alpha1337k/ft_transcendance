import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../modules/interfaces';
import { SocketService } from '../socket.service';

class vec_2 {
	x : number;
	y : number;
	constructor(x : number, y : number) {
		this.x = x;
		this.y = y;
	}
}

class line {
	p1 : vec_2;
	p2 : vec_2;
	constructor(p1 : vec_2, p2 : vec_2) {
		this.p1 = p1;
		this.p2 = p2;
	}
}

class positionUpdate {
	id: number = 0;
	newpos: vec_2;

	constructor(id : number, newpos : vec_2) {
		this.id = id;
		this.newpos = newpos;
	}
}

const keys	: Array<boolean> = new Array<boolean>(3);


@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.css']
})
export class PongComponent implements OnInit {
	p1: User | undefined;
	p2: User | undefined;
	p1_score : number = 0;
	p2_score : number = 0;
	connections: Subscription[] = [];


	@ViewChild('canvas', { static: true }) 
	canvas: ElementRef<HTMLCanvasElement> | undefined;

	private ctx: CanvasRenderingContext2D | undefined | null;
	private width	: number = 0;
	private height	: number = 0;
	private widthMul	: number = 0;
	private heightMul	: number = 0;

	private p1_pos: vec_2 = new vec_2(0,0);
	private p2_pos: vec_2 = new vec_2(0,0);
	private playerPos1: vec_2 = new vec_2(0,0);
	private playerPos2: vec_2 = new vec_2(0,0);

	private ballpos: vec_2 = new vec_2(0, 0);

	private walls: line[] = [];
	private lasttime: number | undefined;
	private deltatime: number = 0;

	private gameId: string = "";
	private userId: number = 0;



  constructor(private ws: SocketService, private route: ActivatedRoute) { }
  
  ngOnInit(): void {

	this.connections.push(this.route.params.subscribe(params => {
		this.gameId = params['id'];
		this.userId = parseInt(params['usr']);

	}));
	if (this.canvas === undefined)
		return;
	this.ctx = this.canvas.nativeElement.getContext('2d');
	this.width = this.canvas.nativeElement.width;
	this.height = this.canvas.nativeElement.height;
	this.widthMul	= this.width / 100;
	this.heightMul	= this.height / 150;
	window.addEventListener('keydown', this.get_keydown);
	window.addEventListener('keyup', this.get_keyup);
	

	this.connections.push(this.ws.create_obs("getGameData").subscribe((data) => {
		this.walls = data.walls;
		this.playerPos2 = data.p1_pos;
		this.playerPos1 = data.p2_pos;
		this.ballpos = data.ballPos;		
	}));

	this.connections.push(this.ws.create_obs("getScoreUpdate").subscribe((data) => {
		if (data.id === 0)
			this.p1_score = data.value;
		else
			this.p2_score = data.value;
	}));

	this.connections.push(this.ws.create_obs("gameFinished").subscribe((data) => {
		console.log("game done!");
	}));

	this.connections.push(this.ws.create_obs("getGameUpdate").subscribe((data) => {
		//console.log("gameupdate!!", data);
		if (this.lasttime == undefined)
			this.lasttime = Date.now();
		this.deltatime = (Date.now() - this.lasttime) / 1000;
		this.lasttime = Date.now();
		this.ballpos = data.ballPos;
		console.log("old", this.playerPos1);
		this.playerPos1 = new vec_2(data.p1_pos.x, data.p1_pos.y);
		this.playerPos2 = new vec_2(data.p2_pos.x, data.p2_pos.y);
		console.log("new", this.playerPos1);
		this.render();
		this.sendUpdate();
	}));

  }
	get_keydown(e : any) {
		console.log("keys enzo", e.code, keys);
		switch (e.code) {
			case "KeyA":
				keys[0] = true;
				break;
			case "KeyD":
				keys[1] = true;
				break;
			case "ShiftLeft":
				keys[2] = true;
				break;
			//case "CapsLock":
			//	g_break = !g_break;
			default:
				break;
		}
	}

	get_keyup(e : any) {
		console.log("keys enzo 2", e.code, keys);

		switch (e.code) {
			case "KeyA":
				keys[0] = false;
				break;
			case "KeyD":
				keys[1] = false;
				break;
			case "ShiftLeft":
				keys[2] = false;
				break;
			default:
				break;
		}
	}


  render() {
	if (this.ctx === null || this.ctx === undefined)
		return;
	this.ctx.clearRect(0, 0, this.width, this.height);

	const p1_topl = new vec_2((this.playerPos2.x * this.widthMul), (this.playerPos2.y * this.heightMul));
	const p2_topl = new vec_2((this.playerPos1.x * this.widthMul), (this.playerPos1.y * this.heightMul));

	// dotted middle line
	this.ctx.beginPath();
	this.ctx.setLineDash([10, 20]);
	this.ctx.moveTo(10, this.height / 2);
	this.ctx.lineTo(this.width - 10, this.height / 2);
	this.ctx.stroke();
	this.ctx.setLineDash([]);

	// draw p1
	this.ctx.beginPath();
	this.ctx.fillStyle = "#FF0000";
	this.ctx.fillRect(p1_topl.x, p1_topl.y, 10 * this.widthMul, 10);

	// draw player
	this.ctx.beginPath();
	this.ctx.fillStyle = "#00FF00";
	this.ctx.fillRect(p2_topl.x, p2_topl.y, 10 * this.widthMul, 10);

	// draw ball
	this.ctx.fillStyle = "#0000FF";
	this.ctx.fillRect((this.ballpos.x * this.widthMul) - 5, (this.ballpos.y * this.heightMul) - 5, 10, 10);
	this.ctx.stroke();
	this.ctx.lineWidth = 8;

	// draw walls
	for (let index = 0; index < this.walls.length; index++) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = 'white';
		this.ctx.moveTo(this.walls[index].p1.x * this.widthMul, this.walls[index].p1.y * this.heightMul);
		this.ctx.lineTo(this.walls[index].p2.x * this.widthMul, this.walls[index].p2.y * this.heightMul);
		this.ctx.stroke();
	}

  }

  sendUpdate() {
	let oldx = this.playerPos1.x;
	let player;
	if (this.userId === 1)
		player = this.playerPos1;
	else
		player = this.playerPos2;

	if (!keys[0] && !keys[1])
		return;
	const movespeed = 50;
	if (keys[2])
		movespeed * 1.5;
	if (keys[0])
		player.x -= movespeed * this.deltatime;
	if (keys[1])
		player.x += movespeed * this.deltatime;
	console.log("newpos", player.x, keys, "oldpos ", oldx);
	this.ws.sendMessage("sendClientUpdate", {id: this.gameId, updt: new positionUpdate(this.userId, player)});
  }

  
}
 
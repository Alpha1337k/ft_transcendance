var c;
var ctx;
var width;
var height;
var	heightMul;
var	widthMul;


let g_keys = new Array(3);
let	g_walls;
let	g_ball_pos;
let g_player_pos	;
let g_enemy_pos;
let	g_player_width = 40;
let	lasttime = undefined;
let	deltatime;

let	g_gameId;
let	g_userId;

function get_keydown(e) {
	switch (e.code) {
		case "KeyA":
			g_keys[0] = 1;
			break;
		case "KeyD":
			g_keys[1] = 1;
			break;
		case "ShiftLeft":
			g_keys[2] = 1;
			break;
		case "CapsLock":
			g_break = !g_break;
		default:
			break;
	}
}

function get_keyup(e) {
	switch (e.code) {
		case "KeyA":
			g_keys[0] = 0;
			break;
		case "KeyD":
			g_keys[1] = 0;
			break;
		case "ShiftLeft":
			g_keys[2] = 0;
			break;
		default:
			break;
	}
}

function render() {
	ctx.clearRect(0, 0, width, height);
	player_topl = new vec_2((g_player_pos.x * widthMul), (g_player_pos.y * heightMul));
	enemy_topl = new vec_2((g_enemy_pos.x * widthMul), (g_enemy_pos.y * heightMul));

	// dotted middle line
	ctx.beginPath();
	ctx.setLineDash([10, 20]);
	ctx.moveTo(10, height / 2);
	ctx.lineTo(width - 10, height / 2);
	ctx.stroke();
	ctx.setLineDash([]);

	// draw player
	ctx.beginPath();
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(player_topl.x, player_topl.y, 10 * widthMul, 10);
	
	// draw player
	ctx.beginPath();
	ctx.fillStyle = "#00FF00";
	ctx.fillRect(enemy_topl.x, enemy_topl.y, 10 * widthMul, 10);

	// draw ball
	ctx.fillStyle = "#0000FF";
	ctx.fillRect((g_ball_pos.x * widthMul) - 5, (g_ball_pos.y * heightMul) - 5, 10, 10);
	ctx.stroke();
	ctx.lineWidth = 8;


	// draw walls
	for (let index = 0; index < g_walls.length; index++) {
		ctx.beginPath();
		ctx.strokeStyle = 'white';
		ctx.moveTo(g_walls[index].p1.x * widthMul, g_walls[index].p1.y * heightMul);
		ctx.lineTo(g_walls[index].p2.x * widthMul, g_walls[index].p2.y * heightMul);
		ctx.stroke();
	}
}

async function sendUpdate() {
	if (!g_keys[0] && !g_keys[1])
		return;
	let movespeed = 50;
	if (g_keys[2])
		movespeed *= 1.5;
	if (g_keys[0])
		g_player_pos.x -= movespeed * deltatime;
	if (g_keys[1])
		g_player_pos.x += movespeed * deltatime;
	g_socket.emit("sendClientUpdate", {id : g_gameId, updt :new positionUpdate(g_userId, g_player_pos)});
}

async function getGameData() {
	console.log("awaiting gamedata");
	g_socket.emit("getGameData", g_gameId);
}

async function createHTMLHooksPong() {
	c = document.getElementById("pong-canvas");
	ctx = c.getContext("2d");
	width = c.getAttribute("width");
	height = c.getAttribute("height");
	window.addEventListener('keydown',this.get_keydown,false);
	window.addEventListener('keyup',this.get_keyup,false);
	heightMul = height / 150;
	widthMul = width / 100;
}

g_socket.on("gameFound", data => {
	console.log("game is found!");
	g_gameId = data.gameId;
	g_userId = data.userId;
	LoadMainContent("pong/" + g_gameId, "#main-box", "Playing pong!");
	getGameData();
});

g_socket.on("gameFinished", data => {
	console.log("game done!!");
});

g_socket.on("getGameData", data => {
	console.log("data", data);
	g_player_pos = data.p1_pos;
	g_enemy_pos = data.p2_pos;
	g_walls = data.walls;
	g_ball_pos = data.ballPos;
});

g_socket.on("getScoreUpdate", data => {
	if (data.id == 0)
		document.getElementById("p1_score").innerHTML = data.value;
	else
		document.getElementById("p2_score").innerHTML = data.value;
});

g_socket.on("getGameUpdate", data => {
	//console.log("gameupdate!!", data);
	if (lasttime == undefined)
		lasttime = Date.now();
	deltatime = (Date.now() - lasttime) / 1000;
	lasttime = Date.now();
	g_ball_pos = data.ballPos;
	if (g_userId == 1)
	{
		g_player_pos = data.p1_pos;
		g_enemy_pos = data.p2_pos;
	}
	else
	{
		g_player_pos = data.p2_pos;
		g_enemy_pos = data.p1_pos;
	}
	render();
	sendUpdate();
});


var c;
var ctx;
var width;
var height;

let	g_player_pos;
let	g_ball_pos;
let	g_ball_speed = 300;
let	g_ball_dir;
let	g_ball_exists = false;
let	g_ball_ang;
let	g_borders = [];
var g_keys = new Array(3);
var	g_break = false;
var	g_player_width = 80;
var	g_renderid;

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

function update_movement(deltatime) {
	var movement_speed = 200 * deltatime;
	if (g_keys[2])
		movement_speed *= 1.5;
	if (g_keys[0])
		g_player_pos.x = g_player_pos.x - movement_speed < 20 ? 20 : g_player_pos.x - movement_speed;
	if (g_keys[1])
		g_player_pos.x = g_player_pos.x + movement_speed > width - g_player_width ? width - g_player_width : g_player_pos.x + movement_speed;
}

function calculate_borders() {
	g_borders.push(new line(new vec_2(10, 10),			new vec_2(width - 10, 10)));
	// g_borders.push(new line(new vec_2(10, height - 10),	new vec_2(10 + width / 5, height - 10)));
	// g_borders.push(new line(new vec_2(width - 10 - width / 5, height - 10),	new vec_2(width - 10, height - 10)));
	g_borders.push(new line(new vec_2(10, 10),			new vec_2(10, height - 10)));
	g_borders.push(new line(new vec_2(width - 10, 10),	new vec_2(width - 10, height - 10)));
	// g_borders.push(new line(new vec_2(width / 2 + width / 3, height / 2),	new vec_2(width / 2 + width / 4, height / 2)));
}

function ccw(A, B, C)
{
	return (C.y - A.y) * (B.x - A.x) > (B.y -A.y) * (C.x - A.x);
}

function intersect(p1, p2, p3, p4)
{
	return (ccw(p1, p3, p4) != ccw(p2, p3, p4) && ccw(p1, p2, p3) != ccw(p1, p2, p4));	
}

function update_game(deltatime) {
	if (g_ball_exists == false)
	{
		g_ball_speed = 150;
		g_ball_ang = (Math.random() * 45) + 45;
		if (Math.random() > 0.5)
			g_ball_ang += 180;
		g_ball_dir = new vec_2(Math.cos(g_ball_ang * 0.0174532925), Math.sin(g_ball_ang * 0.0174532925));
		g_ball_pos = new vec_2(width / 2, height / 2);
		g_ball_exists = true;
	}
	else
	{
		let oldpos = new vec_2(g_ball_pos.x, g_ball_pos.y);
		g_ball_pos.x += g_ball_dir.x * deltatime * g_ball_speed;
		g_ball_pos.y -= g_ball_dir.y * deltatime * g_ball_speed;

		for (let index = 0; index < g_borders.length; index++) {
			const element = g_borders[index];
			if (intersect(oldpos, g_ball_pos, element.p1, element.p2))
			{
				g_ball_speed *= 1.05;
				if (element.p1.y < element.p2.y)
					g_ball_dir.x = -g_ball_dir.x;
				else
					g_ball_dir.y = -g_ball_dir.y;
				g_ball_pos.x += g_ball_dir.x * deltatime * g_ball_speed;
				g_ball_pos.y -= g_ball_dir.y * deltatime * g_ball_speed;
				break;
			}
		}
		let player_end = new vec_2(g_player_pos.x + g_player_width, g_player_pos.y);
		if (intersect(oldpos, g_ball_pos, g_player_pos, player_end))
		{
			g_ball_speed *= 1.1;
			console.log("COLLISSION!!");
			g_ball_dir.y = -g_ball_dir.y;
			g_ball_ang = Math.atan2(g_ball_dir.y, g_ball_dir.x) * 57.2957795;
			g_ball_ang += (g_ball_pos.x - g_player_pos.x) / g_player_width * 30 - 15;
			//console.log(g_ball_pos.x, g_player_pos.x, g_player_width * 30 - 15);
			//console.log((g_ball_pos.x - g_player_pos.x) / g_player_width * 30 - 15);
			g_ball_dir.x = Math.cos(g_ball_ang * 0.0174532925);
			g_ball_dir.y = Math.sin(g_ball_ang * 0.0174532925);
			if (g_ball_ang > 360)
				g_ball_ang = g_ball_ang % 360;
			else if (g_ball_ang < 0)
				g_ball_ang = 360 +  g_ball_ang;
			g_ball_pos.x += g_ball_dir.x * deltatime * g_ball_speed;
			g_ball_pos.y -= g_ball_dir.y * deltatime * g_ball_speed;
		}
		if (g_ball_pos.y < 0)
		{
			console.log("good job!");
			g_ball_exists = 0;
		}
		else if (g_ball_pos.y > height)
		{
			console.log("nice try!");
			g_ball_exists = 0;
		}
	}
}

function render() {
	tl = new vec_2(g_player_pos.x, g_player_pos.y - 5);
	
	// draw player
	ctx.beginPath();
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(tl.x, tl.y, g_player_width, 10);
	
	// draw ball
	ctx.fillRect(g_ball_pos.x - 10, g_ball_pos.y - 10, 20, 20);
	ctx.stroke();
	ctx.lineWidth = 8;

	// dotted middle line
	ctx.beginPath();
	ctx.setLineDash([10, 20]);
	ctx.moveTo(10, height / 2);
	ctx.lineTo(width - 10, height / 2);
	ctx.stroke();
	ctx.setLineDash([]);

	// draw walls
	for (let index = 0; index < g_borders.length; index++) {
		ctx.beginPath();
		ctx.strokeStyle = 'white';
		ctx.moveTo(g_borders[index].p1.x, g_borders[index].p1.y);
		ctx.lineTo(g_borders[index].p2.x, g_borders[index].p2.y);
		ctx.stroke();
	}
}

async function start() {
	g_player_pos = new vec_2(width / 2, height - 10);
	let lasttime = Date.now();
	let	deltatime;
	calculate_borders();

	console.log("Pos: ", g_player_pos);
	g_renderid = setInterval(() => {
		if (g_break == true)
		{
			lasttime = Date.now();
		}
		else
		{
			deltatime = (Date.now() - lasttime) / 1000;

			update_movement(deltatime);
			update_game(deltatime);
			
			ctx.clearRect(0, 0, width, height);
			render();

			lasttime = Date.now();
		}
	}, 1000 / 60);
}

function createpongtable(id, isTraining)
{
	c = id;
	ctx = c.getContext("2d");
	width = c.getAttribute("width");
	height = c.getAttribute("height");
	window.addEventListener('keydown',this.get_keydown,false);
	window.addEventListener('keyup',this.get_keyup,false);
	start();
}

createpongtable(document.getElementById('training-pong-canvas'), true);
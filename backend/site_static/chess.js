let board = Array(64);
let playerside = false;
let flipped = 1;

let uniqueid = 0;
let gamedata;
let userid;
let gameid;

let uiInterval;

class Piece {
	constructor(obj, value, draggable) {
		this.obj = obj;
		this.value = value;
		if (obj && draggable == true) dragElement(obj);
	}
}

function convertPXToVh(px) {
	return px * (100 / document.documentElement.clientHeight);
}

function dragElement(elmnt) {
	let pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;
	let oldposX = -1,
		oldposY = -1;
	if (oldposX == -1) {
		oldposX = parseFloat(elmnt.style.left);
		oldposY = parseFloat(elmnt.style.top);
	}
	elmnt.onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;

		//if (oldposX == -1)
		//{
		//	oldposX = parseFloat(elmnt.style.left);
		//	oldposY = parseFloat(elmnt.style.top);
		//}
		// set the element's new position:
		elmnt.style.top = convertPXToVh(elmnt.offsetTop - pos2 * flipped) + 'vh';
		elmnt.style.left = convertPXToVh(elmnt.offsetLeft - pos1) + 'vh';
	}

	function closeDragElement(e) {
		/* stop moving when mouse button is released:*/
		document.onmouseup = null;
		document.onmousemove = null;

		console.log('Dropped', e);
		if (
			(e.path[0].id[0] == e.path[0].id[0].toLowerCase()) !=
			gamedata.whiteMove
		) {
			console.log('not allowed 1');
			elmnt.style.top = oldposY + 'vh';
			elmnt.style.left = oldposX + 'vh';
			return;
		}
		let middleLeft =
			parseFloat(e.path[0].style.left) + 3.125 - convertPXToVh(pos2);
		let middleTop =
			parseFloat(e.path[0].style.top) + 3.125 - convertPXToVh(pos1);

		middleLeft -= middleLeft % 6.25;
		middleTop -= middleTop % 6.25;

		middleLeft = middleLeft / 6.25;
		middleTop = middleTop / 6.25;

		e.path[0].style.top = middleTop * 6.25 + 'vh';
		e.path[0].style.left = middleLeft * 6.25 + 'vh';

		const objToSend = {
			gameid,
			newpos: middleTop * 8 + middleLeft,
			oldpos: (oldposY / 6.25) * 8 + oldposX / 6.25,
		};
		oldposX = -1;
		oldposY = -1;
		move_piece(objToSend.oldpos, objToSend.newpos);
		console.log(objToSend);
		g_socket.emit('sendChessMove', objToSend);
	}
}

function creatediv(posT, posL, img, clr, selectable) {
	let board = document.getElementById('C_board');
	let div = document.createElement('div');
	div.id = clr + uniqueid++;
	div.className = 'C_piece';
	if (clr == clr.toLowerCase()) div.className += ' w';
	else div.className += ' b';
	if (selectable == false) div.className += ' unselectable';
	div.innerHTML = img;
	if (selectable)
		div.style = 'top: ' + posT + 'vh; left: ' + posL + 'vh' + '; z-index: 10';
	else div.style = 'top: ' + posT + 'vh; left: ' + posL + 'vh';

	board.appendChild(div);
	return div;
}

function createpiece(type, pos, selectable) {
	let posT = Math.floor(pos / 8) * 6.25;
	let posL = (pos % 8) * 6.25;
	switch (type) {
		case 'r':
			return creatediv(posT, posL, '♖', 'r', selectable);
		case 'k':
			return creatediv(posT, posL, '♔', 'k', selectable);
		case 'q':
			return creatediv(posT, posL, '♕', 'q', selectable);
		case 'b':
			return creatediv(posT, posL, '♗', 'b', selectable);
		case 'n':
			return creatediv(posT, posL, '♘', 'n', selectable);
		case 'p':
			return creatediv(posT, posL, '♙', 'p', selectable);
		case 'R':
			return creatediv(posT, posL, '♜', 'R', selectable);
		case 'K':
			return creatediv(posT, posL, '♚', 'K', selectable);
		case 'Q':
			return creatediv(posT, posL, '♛', 'Q', selectable);
		case 'B':
			return creatediv(posT, posL, '♝', 'B', selectable);
		case 'N':
			return creatediv(posT, posL, '♞', 'N', selectable);
		case 'P':
			return creatediv(posT, posL, '♟︎', 'P', selectable);
		default:
			break;
	}
}

function loadfen(fen) {
	document.getElementById('C_board').innerHTML = '';
	console.log('xd');
	let pos = 0;
	for (let index = 0; index < fen.length && fen[index] != ' '; index++) {
		const element = fen[index];
		if (element == '/') continue;
		if (element > '0' && element < '9') pos += element - '0';
		else {
			board[pos] = new Piece(
				createpiece(
					element,
					pos,
					(element == element.toLowerCase()) == playerside
				),
				element,
				(element == element.toLowerCase()) == playerside
			);
			pos++;
		}
	}
}

function move_piece(oldpos, newpos, no_remove) {
	if (board[oldpos] == undefined || oldpos == newpos) return;
	if (board[newpos] != undefined && no_remove != true)
		board[newpos].obj.parentNode.removeChild(board[newpos].obj);
	board[newpos] = board[oldpos];
	board[newpos].obj.style.top = Math.floor(newpos / 8) * 6.25 + 'vh';
	board[newpos].obj.style.left = (newpos % 8) * 6.25 + 'vh';
	board[oldpos] = undefined;
}

function flip() {
	let text = '';
	if (flipped == 1) text = 'rotate(180deg) scaleX(-1)';
	document.getElementById('C_board').style.transform = text;
	let pieces = document.getElementsByClassName('C_piece');
	for (let index = 0; index < pieces.length; index++) {
		const element = pieces[index];
		element.style.transform = text;
	}
	flipped = -flipped;
}

async function update_ui() {
	uiInterval = setInterval(() => {
		let p1_cur =
			gamedata.playerTime[0] - (Date.now() - gamedata.turnStart) / 1000;
		let p2_cur =
			gamedata.playerTime[1] - (Date.now() - gamedata.turnStart) / 1000;
		if (gamedata.whiteMove && gamedata.firstTurn[1] == false)
			document.getElementById('p2_timer').innerHTML =
				Math.floor(p2_cur / 60) + ':' + Math.round(p2_cur % 60);
		else if (gamedata.firstTurn[0] == false)
			document.getElementById('p1_timer').innerHTML =
				Math.floor(p1_cur / 60) + ':' + Math.round(p1_cur % 60);
	}, 1000);
}

g_socket.on('getChessGameData', (data) => {
	console.log('getChessGameData', data);
	gameid = data.gameId;
	userid = data.userId;
	gamedata = data.game;
	if (userid == 1) playerside = true;

	loadfen(data.game.fen);
	if (userid == 1) flip();
	console.log(gamedata);
	update_ui();
});

g_socket.on('chessGameFound', (data) => {
	LoadMainContent('chess/' + data.gameId, '#main-box', 'Chess');
});

g_socket.on('revertMove', (data) => {
	console.log('revertMove!', data);
	move_piece(data.newpos, data.oldpos, true);
});

g_socket.on('moveUpdate', (data) => {
	console.log('MoveUpdate!', data);
	move_piece(data.oldpos, data.newpos);
	if (data.iscastle != undefined)
		move_piece(data.iscastle.oldpos, data.iscastle.newpos);
	gamedata = data.game;
});

class vec_2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class line {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
	}
}

class positionUpdate {
	id;
	newpos;

	constructor(id, newpos) {
		this.id = id;
		this.newpos = newpos;
	}
}

function ChangeURL(title, urlPath, id) {
	console.log('push page', title, urlPath);
	window.history.pushState(
		{ ob: urlPath, id: id, title: title },
		undefined,
		'?' + urlPath
	);
}

window.onpopstate = function (e) {
	console.log('pop page', e);
	if (e.state) {
		document.title = e.state.title;
		LoadMainContent(e.state.ob, e.state.id, e.state.title, false);
	} else {
	}
};

var minimizeChat = function (param) {
	let base = param.parentElement.parentElement.parentElement;
	if (base.style.height == '4vh') {
		base.style.height = '30vh';
		base.style.top = '0';
	} else {
		base.style.height = '4vh';
		base.style.position = 'relative';
		base.style.top = '26vh';
	}
};

var removeChat = function (param) {
	let base = param.parentElement.parentElement.parentElement;
	base.remove();
};

var LoadMainContent = function (page, dom, pagename, pushUrl) {
	return new Promise(function (resolved, myReject) {
		console.log('loading ' + page + ' into', dom);
		if (typeof dom === '') dom = '#main-box';
		if (pagename != undefined && pushUrl != false)
			ChangeURL(pagename, page, dom);
		$(dom).val('');
		$(dom).load(page, function () {
			resolved();
		});
	});
};

async function loginUser() {
	/*
		login
	*/
	LoadMainContent('struct', 'body').then(function () {
		LoadMainContent('homepage.html', '#main-box', 'Home').then(function () {
			LoadMainContent('friends', '#friends-list');
		});
	});
}

async function checkquery() {
	if (window.location.search.length > 0) {
		await LoadMainContent('struct', 'body');
		await LoadMainContent('friends', '#friends-list');
		await LoadMainContent(
			window.location.search.substr(1),
			'#main-box',
			'Pong',
			false
		);
	}
}

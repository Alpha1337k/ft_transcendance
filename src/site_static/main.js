function ChangeURL(title, urlPath, id){
	console.log("push page", title);
	window.history.pushState({ob : urlPath, id : id}, title, urlPath);
}

window.onpopstate = function(e){
	console.log("pop page", e);
    if(e.state){
		document.title = e.state.pageTitle;
		LoadMainContent(e.state.ob.substring(1), e.state.id, e.state.ob, false);
    }
	else
	{
		LoadMainContent("homepage.html", "#main-box");
	}
};

var minimizeChat = function(param)
{
	let base = param.parentElement.parentElement.parentElement;
	if(base.style.height == '4vh')
	{
		base.style.height = '30vh';
		base.style.top = '0';
	}
	else
	{
	base.style.height = '4vh';
	base.style.position = 'relative';
	base.style.top = '26vh';
	}
};

var removeChat = function(param)
{
	let base = param.parentElement.parentElement.parentElement;
	base.remove();
};

var LoadMainContent = function (page, dom, pagename, pushUrl) {	
	return new Promise(function(resolved, myReject) {
		// "Producing Code" (May take some time)
		console.log("loading data into", dom);
		if(typeof dom === '')
			dom = "#main-box";
		if (pagename != undefined && pushUrl != false)
			ChangeURL(pagename, "#"+page, dom);
		$(dom).val('');
		$(dom).load(page, function() {resolved()});
		});
}

async function loginUser() {
	/*
		login
	*/
	LoadMainContent("struct.html", "body").then(function () {
	LoadMainContent("homepage.html", "#main-box", "Play Pong").then(function () {
	LoadMainContent("friends.html", "#friends-tab");
	});
	});


	//await LoadMainContent("struct.html", "Play Pong", "body", true);
	//await LoadMainContent("homepage.html", "", "#main-box", true);
	//await LoadMainContent("friends.html", "", "#friends-tab", true); 

}
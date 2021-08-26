let g_socket;

function messagesend() {
	console.log("sending message!");
	g_socket.emit("sendChatMessage", {userid:1, chatid: 1, message: document.getElementById("mshh").value});
}

async function connect() {
	g_socket = io("http://localhost:5000/");
	

	g_socket.on("connect", () => {
		console.log("connected!!!");
	});

	g_socket.on("msgToClients", data => {
		console.log("message recieved!!", data);
		document.getElementsByClassName("messagebox")[0].innerHTML += data.message;
	});
}

connect();
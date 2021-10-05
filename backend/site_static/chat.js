function messagesend(this) {
	console.log("sending message!");
	g_socket.emit("sendChatMessage", {userid:1, chatid: 2, message: document.getElementById("mshh").value});

	document.getElementById("mshh").value = '';
}

// function scrollchat() {
//
// }

g_socket.on("connect", () => {
	console.log("connected!!!");
});

g_socket.on("msgToClients", data => {
	console.log("message recieved!!", data);
	document.getElementsByClassName("messagebox")[0].innerHTML += data;
});

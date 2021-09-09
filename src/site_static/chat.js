
function messagesend() {
	console.log("sending message!");
	g_socket.emit("sendChatMessage", {userid:1, chatid: 1, message: document.getElementById("mshh").value});
}

g_socket.on("connect", () => {
	console.log("connected!!!");
});

g_socket.on("msgToClients", data => {
	console.log("message recieved!!", data);
	document.getElementsByClassName("messagebox")[0].innerHTML += data;
});

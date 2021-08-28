let g_socket;

async function connect() {
	g_socket = io("http://localhost:5000/");
	

	g_socket.on("connect", () => {
		console.log("connected!!!");
	});

	g_socket.on("disconnect", () => {
		console.log("socket gone");
		g_socket.destroy();
	});
}

connect();
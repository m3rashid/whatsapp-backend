const { DEDICATED_COMPRESSOR_3KB, App } = require("uWebSockets.js");
const { ReceivedSocketMessage } = require("./sockets");
const app = App();

app.ws("/*", {
	idleTimeout: 32,
	maxBackpressure: 1024,
	maxPayloadLength: 512,
	compression: DEDICATED_COMPRESSOR_3KB,

	/* For brevity we skip the other events (upgrade, open, ping, pong, close) */
	message: (ws, message, isBinary) => {
		/* You can do app.publish('sensors/home/temperature', '22C') kind of pub/sub as well */
		const msg = new ReceivedSocketMessage(message);
		/* Here we echo the message back, using compression if available */
		ws.send(JSON.stringify(msg), isBinary, true);
	},
})

app.get("/*", (res, req) => {
	res
		.writeStatus("200 OK")
		.writeHeader("IsExample", "Yes")
		.end("Hello there!");
})

app.listen(9001, (listenSocket) => {
	if (listenSocket) {
		console.log("Listening to port 9001");
	}
})

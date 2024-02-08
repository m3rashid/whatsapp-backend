const { checkToken } = require("./auth");

/**
 * @class
 * @classdesc Class to work with received socket messages
 */
class ReceivedSocketMessage {
	/**
	 * @type {string}
	 */
	message = null;

	/**
	 * @type {string}
	 */
	token = null;

	/**
	 * @param { ArrayBuffer} buffer
	 */
	constructor(buffer) {
		const decoder = new TextDecoder();
		try {
			/**
			 * @type {{ message: string, token: string }}
			 */
			const incomingMessage = JSON.parse(decoder.decode(buffer));
			if (!incomingMessage.message || !incomingMessage.token) {
				throw new Error("Invalid message");
			}

			if (!checkToken(incomingMessage.token)) {
				throw new Error("Invalid token");
			}

			this.message = incomingMessage.message;
			this.token = incomingMessage.token;
		} catch (err) {
			console.error(err);
		}
	}

	get message() {
		return this.message;
	}
}

module.exports = {
	ReceivedSocketMessage
}

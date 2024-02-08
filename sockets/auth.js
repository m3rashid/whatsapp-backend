const jwt = require("jsonwebtoken");

/**
 * @param {string} token 
 * @returns {boolean}
 */
function checkToken(token) {
	try {
		if (!token) return false;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// todo validate
		return true
	} catch (err) {
		console.error('JWT ERROR:', err);
		return false;
	}
}

/**
 * @param {string} userID 
 * @param {string} userContactNumber
 * @returns {string}
 */
function generateToken(userID, userContactNumber) {
	return jwt.sign({
		sub: { id: userID, contact: userContactNumber },
		iat: Date.now(),
	}, process.env.JWT_SECRET, { expiresIn: "1h" });
}

module.exports = {
	checkToken,
	generateToken
}

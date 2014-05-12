
var utils = require("./utils");
var render = require("./render");

module.exports = {

	isLoggedIn: utils.isLoggedIn,

	generateUID: utils.generateUID,

	render: {
		profile: render.profile
	}
}
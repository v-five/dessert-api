
module.exports = {

	secret : function(){
		return uuid;
	}

};

var uuid = require("../utils").generateUID();
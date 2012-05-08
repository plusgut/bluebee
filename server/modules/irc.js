exports.module = function(){
	//The complete thing needs a refactoring, especially the event-handling
	var irc = require("irc");
	var self = this;

	this.main = function( cb ){
		cb();
		bb.log("irc is up and running");
		this.on("api_create_irc", this.ircHandler);
	};

	this.ircHandler = function( req, userHandle, cb ){
		var content = req.content
		if(req.model == "Irc.Connection"){
			var client = new irc.Client( content.server, content.user, { channels: [ content.channel ] } );
			userHandle.set("irc",client);
			userHandle.on('disconnect', function () {
				bb.log("he disconnected");
				client.disconnect("bluebee.org rulez");
			});

			client.on("message" +content.channel, function (from, message) {
				var record = { createRecord: { content: 
									{ message: message, channel: content.channel, user: message, type: "s2c" }, 
								model: 'Irc.Message', 
								requestKey: Math.random() } };
				userHandle.emit( "s2c", record );
			});
			
		} else if( req.model = "Irc.Message" ){
			userHandle.get("irc", function(err, client){
				client.say( content.channel, content.message );
			});
		}
	};
};

exports.module = function(){
	
	var http	= require( "http" );
	////-----------------------------------------------------------------------------------------
 	//The Constructor
	this.main = function( cb ){
		cb();
	}

	////-----------------------------------------------------------------------------------------
 	//The http-server itself!
	this.httpServer = function(){
		var server = http.createServer( function (req, res) {
			var bbRequest = req; //#ToDo create the real request (a mix of req and res
			bb.core.http.httpHandler( bbRequest, res );
		}).listen( this.bb.conf.port, this.bb.conf.host );
		// Add Socket-Support
	},

	////-----------------------------------------------------------------------------------------
	//The http-handler
	this.httpHandler = function( request, res ){//#ToDo outsorce in an core-file
		var listened = false;
		for( moduleIndex in this.bb.modules ){
			var module = bb.modules[ moduleIndex ];
			var listeners	= module.listeners( request.url ).length;
			if( listeners ){
				listened = true;
				module.emit( request.url, request, res );
				break;				}
		};

		if( !listened ){ //No Module wanted to handle the request
			res.writeHead(404, { "Content-Type": "text/plain" } );
			res.end( "Not Found" );
		}
	}
}


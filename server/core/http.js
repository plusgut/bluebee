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
	};

	////-----------------------------------------------------------------------------------------
	//The http-handler
	this.httpHandler = function( request, res ){//#ToDo outsorce in an core-file
		//#ToDo throw 401 if a .. exists
		var found = false;
		var url		= request.url.split( "/" )[ 1 ] ;
		if( !url ){
			url = "index";
		}
		for( moduleIndex in this.bb.modules ){
			var module = bb.modules[ moduleIndex ];
			var listeners	= module.listeners( url ).length;
			if( listeners ){
				found = true;
				module.emit( url, request, res );
				break;
			}
		};

		if( !found ){ //No Module wanted to handle the request
			this.writeNotFound( res );
		}
	};
	////-----------------------------------------------------------------------------------------
	//The http-handler
	this.writeNotFound = function( res ){
		res.writeHead(404, { "Content-Type": "text/plain" } );
		res.end( "Not Found" );
	}	
};

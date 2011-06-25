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
		var self = this;
		var server = http.createServer( function (req, res) {
			req.setEncoding("utf8");
			req.content = "";
			req.on( "data", function( content ){
				req.content += content;
			});

			req.on( "end", function(){
				if( req.content ){
					var values = req.content.split('&') ;
					var data = Array();

					for ( valueIndex in values ){
						var pair = values[ valueIndex ].split('=');
						data[ pair[ 0 ] ] = pair[ 1 ];
					}
				}
				var bbRequest = {
							write: bb.core.http.write, 
							writeNotFound: bb.core.http.writeNotFound, 
							ready: false, 
							url: req.url,
							method: req.method,
							data: data,
							origin: { 
								req: req, 
								res: res 
							}
						}; 
					bb.core.http.httpHandler( bbRequest );
			});

		}).listen( this.bb.conf.port, this.bb.conf.host );
		// Add Socket-Support
	};

	////-----------------------------------------------------------------------------------------
	//The http-handler
	this.httpHandler = function( request ){//#ToDo outsorce in an core-file
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
				module.emit( url, request );
				break;
			}
		};

		if( !found ){ //No Module wanted to handle the request
			request.writeNotFound();
		}
	};
	////-----------------------------------------------------------------------------------------
	//The http-answerer
	this.write = function( response, status, header, encoding ){
		//Setting some defaults
		if( !status ){
			status = 200;
		}
		if( !header ){
			header = { "Content-Type": "text/plain" };
		}
		if( !encoding ){
			encoding = "utf8";
		}

		this.origin.res.writeHead( status, header );
		this.origin.res.write( response, encoding );
		this.origin.res.end();
	}


	////-----------------------------------------------------------------------------------------
	//The 404-handler
	this.writeNotFound = function( res ){
		this.write( "Not Found", 404 );
	}	
};

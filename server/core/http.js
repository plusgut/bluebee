exports.module = function(){
	
	var http	= require( "http" );
	var io		= require( "socket.io" );
	var path	= require( "path" );
	var fs		= require( "fs" );
	var mime	= require( "mime" );

	////-----------------------------------------------------------------------------------------
	//The socket-server
	this.socketServer = null;

	////-----------------------------------------------------------------------------------------
	//The Constructor
	this.main = function( cb ){
		cb();
	};

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
					var data = [];

					for( var valueIndex in values ){
						var pair = values[ valueIndex ].split('=');
						data[ pair[ 0 ] ] = pair[ 1 ];
					}
				}
				var bbRequest = {
							write: bb.core.http.write, 
							writeFile: bb.core.http.writeFile, 
							writeNotFound: bb.core.http.writeNotFound, 
							writeNotAllowed: bb.core.http.writeNotAllowed, 
							writeServerFailure: bb.core.http.writeServerFailure, 
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

		});

		self.socketServer = io.listen( server, { "log level": 1 } );

		server.listen( bb.conf.http.port, bb.conf.http.bind );

		self.socketServer.sockets.on('connection', bb.core.http.socketHandler );
	};

	////-----------------------------------------------------------------------------------------
	//The http-handler
	this.httpHandler = function( req ){//#ToDo outsorce in an core-file
		//#ToDo throw 401 if a .. exists
		var found = false;
		var url		= req.url.split( "/" )[ 1 ] ;
		if( !url ){
			url = "index";
		}
		for( var moduleIndex in this.bb.modules ){
			var module = bb.modules[ moduleIndex ];
			var listeners	= module.listeners( url ).length;
			if( listeners ){
				found = true;
				module.emit( url, req );
				break;
			}
		}

		if( !found ){ //No Module wanted to handle the request
			req.writeNotFound();
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
	};

	////-----------------------------------------------------------------------------------------
	//The file-handler
	this.writeFile = function( filename, status ){
		if( !status ){
			status = 200;
		}
		var req	= this;
		path.exists( filename, function( exists ){
			if( !exists ){
				req.writeNotFound();
			} else {
				fs.stat( filename, function (err, stats) {
                    if ( err ) {
						req.writeServerFailure();
					} else  if( stats.isFile() ){
						fs.readFile( filename, "binary", function( err, file ) {
							if ( err ) {
								req.writeServerFailure();
							} else {
								var mimeType = mime.lookup( filename );
								req.write( file, status, {"Content-Type": mimeType }, "binary" );
							}
						});
					} else{
						req.writeNotAllowed();
					}
				});	
			}
		});
	};

	////-----------------------------------------------------------------------------------------
	//The 404-handler
	this.writeNotFound = function(){
		var req	= this;
		var filename	= bb.path + "/client/404.html";
		path.exists( filename , function( exists ) {
			if( !exists ) {
				req.write( "Not Found", 404 );
			} else {
				req.writeFile( filename, 404 );
			}
		});
	};

	////-----------------------------------------------------------------------------------------
	//The 401-handler
	this.writeNotAllowed = function(){
		var req	= this;
		var filename	= bb.path + "/client/401.html";
		path.exists( filename , function( exists ) {
			if( !exists ) {
				req.write( "Not Allowed", 401 );
			} else {
				req.writeFile( filename, 401 );
			}
		});

	};

	////-----------------------------------------------------------------------------------------
	//The 500-handler
	this.writeServerFailure = function(){
		var req	= this;
		var filename	= bb.path + "/client/500.html";
		path.exists( filename , function( exists ) {
			if( !exists ) {
				req.write( "Something went wrong on our Server", 500 );
			} else {
				req.writeFile( filename, 500 );
			}
		});

	};

	////-----------------------------------------------------------------------------------------
	//The socket-handler
	this.socketHandler = function( socket ){
		socket.on('c2s', function (data) {
			bb.log( "client: " );
			bb.log(data);

			var user = null;
			if( socket.user ){
				user = socket.user;
			}

			bb.modules.api.handleApi( data, user, function( response, status, user ){
				socket.emit( "s2c", response );
			});			
		});
		socket.on('s2s', function (data) {
			bb.log( "server: " );
			bb.log(data);
		});
	};
};

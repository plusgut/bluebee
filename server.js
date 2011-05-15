var bluebee = bluebee || (function(){
	/////////////////////////////////////////////////////////////////////////////////////////////////
   
	var
	////=============================================================================================
	// Requirements

		sys		= require( "sys" ),
		http		= require( "http" ),
		fs		= require( "fs" ),
		socket		= require( "socket.io" ),
		EventEmitter	= require( "events" ).EventEmitter,

	////=============================================================================================
	// Propertys

		debug	=  true,

		system	= {},		//Some System ressources
		bb	= {},		//Central object, which is assigned to all modules
		core	= {},		//Holds all Core-Modules
		modules	= {},		//Holds all feature-modules

		ip	= "0.0.0.0",	//The IP the http-server is listening to #ToDo check if its working
		port	= 8080,		//The Port the http-server is listenig to

	////=============================================================================================
	// Methods

		////-----------------------------------------------------------------------------------------
		// Initializer ( Constructor ) 
		init = function(){
			// Output 
			log( "BlueBee is starting now", "prompt" );

			//Some initializations
			loadCore();
			//loadModules(); #ToDo should be done _after_ the core-module are loaded

			process.on( "uncaughtException", function (err ) {
				log( err, "error" );
			});
		},

		////-----------------------------------------------------------------------------------------
		//Loads all the Core-Ressources
 		loadCore = function(){
			loader( process.cwd() + "/server/core", core, loadModules );
		},
        
		////-----------------------------------------------------------------------------------------
		//Loads all the Modules
 		loadModules = function(){
			loader( process.cwd() + "/server/modules", modules, httpServer );
		},

		////-----------------------------------------------------------------------------------------
 		//The loader itself
	        loader = function( path, modulesObj, cb ){
			fs.readdir( path, function( err, files ){
				if( err ){
					log( err );
				} else {
					var i = 0;
					var v = 0;
					files.forEach( function( file ){
						try{
							i++;
                         				var mod				= new require( path + "/" + file );
							mod.module.prototype		= new EventEmitter;
							modulesObj[ file ]		= new mod.module();
							modulesObj[ file ].ready	= false;
						} catch( e ) {
							log( file + ": " + e, "error" );
							log( "Module " + file + " crashed, bluebee is shutting down.", "prompt" );
							//#ToDo shutdown of bluebee
						}

						modulesObj[ file ].on( "ready", function( file ){
							v++;
							if( i === v ){ //Modules are loaded - call the callback
								cb();
							}
						});
						modulesObj[ file ].main();
					});
				}
			});	
		},

		////-----------------------------------------------------------------------------------------
 		//The http-server itself
		httpServer = function(){
			var server = http.createServer( function (req, res) {
				var bbRequest = req; //#ToDo create the real request (a mix of req and res
				httpHandler( bbRequest, res );
			}).listen( port, ip );
			// Add Socket-Support
		},

		////-----------------------------------------------------------------------------------------
 		//The http-server itself
		httpHandler = function( request, res ){
			var listened = false;
			for( moduleIndex in modules ){
				var module = modules[ moduleIndex ];
				var listeners	= module.listeners( request.url ).length;
				if( listeners ){
					listened = true;
					module.emit( request.url, request, res );
					break;
				}
			};

			if( !listened ){ //No Module wanted to handle the request
				res.writeHead(404, { "Content-Type": "text/plain" } );
				res.end( "Not Found" );
			}
		}

		////-----------------------------------------------------------------------------------------
		// Output Messages
		log = function( content, type ){

			if( type == "error" ){
				//Safe to file #ToDo

				//Print if debug-mode
				if( debug ){
					console.log( "---------------------------------------------------------------" );
					console.log( "ERROR - " + new Date() ); //#ToDo change the format
					console.log( content );
					console.trace(); //#ToDo delete last trace-entry (its this one)
					console.log( "---------------------------------------------------------------" );
				}
			} else if( type == "access" ){
				//Safe to file #ToDo

				//Print if debug-mode
				if( debug ){
					console.log( "ACCESS:" );
					console.log( content );
				}
			} else if( type == "prompt" ){
				//Prints it directly to the console
				sys.puts( content );
			} else if( debug ){
				//Print if debug-mode #ToDo safe to file
				console.log( content );
			}
 		};

        
	////---------------------------------------------------------------------------------------------
	;

	/////////////////////////////////////////////////////////////////////////////////////////////////

	////=============================================================================================
	// Call the Constructor

	init();

	////=============================================================================================
	// Public API

	return {
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////
})();

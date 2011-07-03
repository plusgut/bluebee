#!/usr/bin/env node
var bluebee = bluebee || (function(){
	/////////////////////////////////////////////////////////////////////////////////////////////////
   
	var
	////=============================================================================================
	// Requirements

		sys		= require( "sys" ),
		fs		= require( "fs" ),
		socket		= require( "socket.io" ),
		EventEmitter	= require( "events" ).EventEmitter,

	////=============================================================================================
	// Propertys

/*		host	= "0.0.0.0",					//The host of the http-server is listening to #ToDo check if its working
		port	= 8080,						//The Port of the http-server is listenig to*/

		debug	= true;
		path	= process.cwd();

		system	= {},						//Some System ressources
		core	= {},						//Holds all Core-Modules
		modules	= {},						//Holds all feature-modules

	////=============================================================================================
	// Methods

		////-----------------------------------------------------------------------------------------
		// Initializer ( Constructor ) 
		init = function(){
			// Output 
			log( "BlueBee is starting now", "prompt" );

			//Some initializations
			loadConfig();

			process.on( "uncaughtException", function ( err ) {
				log( err, "error" );
			});
		};

		////-----------------------------------------------------------------------------------------
		//Loads the config
		loadConfig = function(){
			//First the config
			var conf			= new require( bb.path + "/server/core/config.js" );
			conf.module.prototype		= new EventEmitter();
			bb.core[ "config" ]		= new conf.module();
			bb.core[ "config" ].bb		= bb;
			bb.core[ "config" ].main( loadCore );
		}

		////-----------------------------------------------------------------------------------------
		//Loads all the Core-Ressources
		loadCore = function(){
			loader( bb.path + "/server/core", bb.core, loadModules );
		};
        
		////-----------------------------------------------------------------------------------------
		//Loads all the Modules
		loadModules = function(){
			loader( bb.path + "/server/modules", bb.modules, bb.core.http.httpServer);
		};

		////-----------------------------------------------------------------------------------------
		//The loader itself
	        loader = function( path, modulesObj, cb ){
			fs.readdir( path, function( err, files ){
				if( err ){
					log( err );
				} else {
					var i = 0;
					var v = 0;

					files.forEach( function( file ){//Counts the modules
						var moduleName			= file.split( "." )[ 0 ];
						if( file[ 0 ] != "." && !modulesObj[ moduleName ] ){
							i++;
						}
					});
					files.forEach( function( file ){
						var moduleName			= file.split( "." )[ 0 ];

						if( file[ 0 ] != "." && !modulesObj[ moduleName ]){
							try{//initializing of the module
								var mod				= new require( path + "/" + file );
								mod.module.prototype		= new EventEmitter();
								modulesObj[ moduleName ]	= new mod.module();
								modulesObj[ moduleName ].bb	= bb;
							} catch( e ) {
								log( file + ": " + e, "error" );
								log( "Module " + file + " crashed, bluebee is shutting down.", "prompt" );
								//#ToDo shutdown of bluebee
							}

							modulesObj[ moduleName ].main( function(){
								v++;
								if( i === v ){ //Modules are loaded - trigger the callback
									cb();
								}
							}); 
						}
					});
				}
			});	
		};

		////-----------------------------------------------------------------------------------------
		// Output Messages
		log = function( content, type ){
			if( type == "error" ){
				//Safe to file #ToDo

				//Print if debug-mode
				if( bb.debug ){
					console.log( "---------------------------------------------------------------" );
					console.log( "ERROR - " + new Date() ); //#ToDo change the format
					console.log( content );
					console.trace(); //#ToDo delete last trace-entry (its this one)
					console.log( "---------------------------------------------------------------" );
				}
			} else if( type == "access" ){
				//Safe to file #ToDo

				//Print if debug-mode
				if( bb.debug ){
					console.log( "ACCESS:" );
					console.log( content );
				}
			} else if( type == "prompt" ){
				//Prints it directly to the console
				sys.puts( content );
			} else if( bb.debug ){
				//Print if debug-mode #ToDo safe to file
				console.log( content );
			}
        };
        
	bb	= { core: core, modules: modules, log: log, path: path, debug: debug, version: '0.0.1' };//Central object, which is assigned to all modules

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

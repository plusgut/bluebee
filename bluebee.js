#!/usr/bin/env node
var bluebee = bluebee || (function(){
	/////////////////////////////////////////////////////////////////////////////////////////////////
   
	var
	////=============================================================================================
	// Requirements

		util		= require( "util" ),
		fs		= require( "fs" ),
		socket		= require( "socket.io" ),
		EventEmitter	= require( "events" ).EventEmitter,

	////=============================================================================================
	// Propertys

		debug	= true;
		path	= process.cwd();

	    	system    = {};						//Some System ressources
		core	= {};//,						//Holds all Core-Modules
		modules	= {};						//Holds all feature-modules

	////=============================================================================================
	// Methods

		////-----------------------------------------------------------------------------------------
		// Initializer ( Constructor ) 
		init = function(){
			switch( process.argv[ 2 ] ){
				case "start":
					// Output
					log( "BlueBee is starting now", "prompt" );

					//Handles the process-events
					processHandler();

					//Writes the pid into a file, and gives a callback for success, and fail
					writePid( 
						function(){
							loadConfig( loadCore );
						}, function(){ 
							log( "BlueBee is already started");
					});
					break;
				case "stop":
					log( "BlueBee is stopping now", "prompt" );
					break;
				case "restart":
					log( "BlueBee is restarting now", "prompt" );
					break;
				case "status" :
					log( "BlueBee status is: ", "prompt" );
					break;
				case "install" :
					log( "BlueBee will now be installed", "prompt" );
					loadConfig( function(){
						var couch			= new require( bb.path + "/server/core/couchdb.js" );
						couch.module.prototype		= new EventEmitter();
						bb.core.couchdb		= new couch.module();
						bb.core.couchdb.bb		= bb;
						bb.core.couchdb.main( function(){
							bb.core.couchdb.install( function(){
								log( "finished installing" );
							});
						} );

					});
					break;
				default:
					log( "Usage: bluebee {start|stop|restart|status}", "prompt" );
			}


		};

		////-----------------------------------------------------------------------------------------
		//Loads the config
		loadConfig = function( cb ){
			//First the config
			var conf			= new require( bb.path + "/server/core/config.js" );
			conf.module.prototype		= new EventEmitter();
			bb.core.config		= new conf.module();
			bb.core.config.bb		= bb;
			bb.core.config.main( cb );
		};

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
					log( err, "error" );
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
		// loadModule
		loadModule = function( type, name ){//currently not used
			var moduleArr;
			if( type == "core" ){
				moduleArr = bb.core;
			} else if( type == "modules" ){
				moduleArr = bb.modules;
			} else {
				throw "loadModule: undefined type";
			}
			var mod				= new require( bb.path + "/server/" + type + "/" + name + ".js" );
			mod.module.prototype		= new EventEmitter();
			moduleArr[ name ]		= new mod.module();
			moduleArr[ name ].bb		= bb;
			moduleArr[ name ].main( cb );
		};	

		////-----------------------------------------------------------------------------------------
		// Process handler
		processHandler = function(){
			process.on( "uncaughtException", function ( err ) {
				log( err, "error" );
			});

			process.on( "exit", function(){
				log( "Im stopping now, right?", "prompt" );
			});

			process.on( "SIGKILL", function(){
				process.exit();
			});

			process.on( "SIGTERM", function(){
				process.exit();
			});

			process.on('SIGINT', function () {//Handles shutdown
				process.exit();
			});
		};

		
		////-----------------------------------------------------------------------------------------
		// Writes the Pid
		writePid = function( cbSuccess, cbFail ){
			cbSuccess(); //ToDo the real handling, and deactivation if in debug-mode
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
				util.puts( content );
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

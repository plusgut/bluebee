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

		system	= {},		// Some System ressources
		bb	= {},		// Central object, which is assigned to all modules
		core	= {},		// Holds all Core-Modules
		modules	= {},		// Holds all feature-modules

	////=============================================================================================
	// Methods

		////-----------------------------------------------------------------------------------------
		// Initializer ( Constructor ) 
		init = function(){
			// Output 
			sys.puts( "BlueBee is starting now" );

			//Some initializations
			loadCore();
			//loadModules(); #ToDo should be done _after_ the core-module are loaded

			process.on( "uncaughtException", function (err ) {
				log( err );
			});
		},

		////-----------------------------------------------------------------------------------------
		//Loads all Core Modules
 		loadCore = function(){
			loader( process.cwd() + "/server/core", core );
		},
        
		 ////-----------------------------------------------------------------------------------------
		//Loads all the other Modules
 		loadModules = function(){
			loader( process.cwd() + "/server/modules", core );
		},

		////-----------------------------------------------------------------------------------------
 		//The loader itself
	        loader = function( path, modulesObj ){
			fs.readdir( path, function( err, files){
				if( err ){
					log( err );
				} else {
					var i = 0;
					var v = 0;
					files.forEach( function( file ){
						try{
                         				var mod				= new require( path + "/" + file );
							mod.module.prototype		= new EventEmitter;
							modulesObj[ file ]		= new mod.module();
							modulesObj[ file ].ready	= false;
							log( modulesObj[ file ] );

							modulesObj[ file ].main();
							log( modulesObj[ file ] );
							modulesObj[ file ].on( "ready", function( file ){
                                				log( "oh, someone is ready!" );
								v++;
								if( i === v ){
									log( "doh, everything is ready!" );
								}
							});
							i++;
						} catch( e ) {
							log( file + ": " + e, "error" );
						}
					});
				}
			});	
		},

		////-----------------------------------------------------------------------------------------
		// Output debug Messages
		log = function( content, type){

			if( type == "error" ){
				//Safe to file #ToDo

				//Print if debug-mode
				if( debug ){
					console.log( "---------------------------------------------------------------" );
					console.log( "ERROR - " + new Date() );
					console.log( content );
					console.trace();
					console.log( "---------------------------------------------------------------" );
				}
			} else if( type == "access" ){
				//Safe to file #ToDo

				//Print if debug-mode
				if( debug ){
					console.log( "ACCESS:" );
					console.log( content );
				}
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

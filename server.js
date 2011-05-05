var bluebee = bluebee || (function(){
    /////////////////////////////////////////////////////////////////////////////////////////////////
   
    var
    ////=============================================================================================
    // Requirements

        sys             = require( "sys" ),
        http            = require( "http" ),
        fs              = require( "fs" ),
        socket		    = require( "socket.io" ),
        EventEmitter    = require( "events" ).EventEmitter,
	
    ////=============================================================================================
    // Propertys

        debug = true,

        system	= {},		// Some System ressources
        bb	    = {},		// Central object, which is assigned to all modules
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
            loadModules();
            
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
                            modulesObj[ file ]              = require( path + "/" + file );
                            modulesObj[ file ].m            = new modulesObj[ file ].module(); 
                            modulesObj[ file ].m.prototype  = new EventEmitter();
                            modulesObj[ file ].m.ready      = false;
                            modulesObj[ file ].m.main();
                            log( modulesObj[ file ] );

                            modulesObj[ file ].m.event.on( "ready", function( file ){
                                log( "oh, someone is ready!" );
                                v++;
                                if( i === v ){
                                    log( "doh, everything is ready!" );
                                }
                            });
                            i++;
                        } catch( e ) {
                            log( file + ": " + e );
                        }
                    });
                }
            });	
        },

        ////-----------------------------------------------------------------------------------------
        // Output debug Messages
        log = function( content){
            if( debug ){
                console.log( content );
            }
        }
        
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
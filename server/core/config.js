exports.module = function(){
	
	var fs              = require( "fs" );

	////-----------------------------------------------------------------------------------------
 	//The Constructor
	this.main = function( cb ){
		fs.readFile( process.cwd() + "/config.json" , "binary", function( err, file ) {
			if( err ){
				bb.log( "Configuration-file loading went wrong, shutting down bb [" + err + "]", "error" );
				bb.log( "Configuration-file loading went wrong, shutting down bb", "prompt" );
			} else {
				try{
					bb.conf		= JSON.parse( file );
					bb.conf.path	= process.cwd();
					cb();
				} catch( err ) {
					bb.log( "Configuration-file was invalid, shutting down bb  [" + err + "]", "error" );
					bb.log( "Configuration-file was invalid, shutting down bb", "prompt" );
				}
			}
		});
	}
};

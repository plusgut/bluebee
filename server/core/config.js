exports.module = function(){
	
	var fs              = require( "fs" );

	////-----------------------------------------------------------------------------------------
 	//The Constructor
	this.main = function( cb ){
		fs.readFile( bb.path + "/config.json" , "binary", function( err, file ) {
			if( err ){
				bb.log( "Configuration-file loading went wrong, shutting down bb [" + err + "]", "error" );
				bb.log( "Configuration-file loading went wrong, shutting down bb", "prompt" );
			} else {
				try{
					bb.conf		= JSON.parse( file );
					if( bb.conf.cloud9 ){
						bb.conf.port = process.env.C9_PORT;
					}
					cb();
				} catch( err ) {
					bb.log( "Configuration-file was invalid, shutting down bb  [" + err + "]", "error" );
					bb.log( "Configuration-file was invalid, shutting down bb", "prompt" );
				}
			}
		});
	}
};

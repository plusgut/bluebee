var path	= require( "path" );
var fs		= require( "fs" );
var mime	= require( "mime" );

exports.module = function(){
	this.main = function( cb ){
		cb();
	}

	this.on( "index", function( req, res ){
		bb.modules.index.getFile( bb.path + "/client/index.html", res );
	});

	this.on( "client", function( req, res ){
		var url = req.url.split( "?" )[ 0 ];
		url = url.split( "#" )[ 0 ] ;
		bb.modules.index.getFile( bb.path + url, res, req );
	});

	this.getFile = function( filename, res, req){
		path.exists(filename, function(exists) {
			if (!exists) {
				bb.core.http.writeNotFound( res )
			} else {
				fs.readFile( filename, "binary", function( err, file ) {
					if ( err ) {
						res.writeHead( 500, {"Content-Type": "text/plain"} );
						res.write(err);
						res.end();
					} else {

						var mimeType = mime.lookup( filename );

						res.writeHead( 200, {"Content-Type": mimeType } );
						res.write( file, "binary" );
						res.end();
					}
				});	
			}
		});
	};
}

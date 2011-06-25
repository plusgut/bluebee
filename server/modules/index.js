var path	= require( "path" );
var fs		= require( "fs" );
var mime	= require( "mime" );

exports.module = function(){
	this.main = function( cb ){
		cb();
	}

	this.on( "index", function( req ){
		bb.modules.index.getFile( bb.path + "/client/index.html", req );
	});

	this.on( "client", function( req, res ){
		var url = req.url.split( "?" )[ 0 ];
		url = url.split( "#" )[ 0 ] ;
		bb.modules.index.getFile( bb.path + url,req );
	});

	this.getFile = function( filename, req){
		path.exists(filename, function(exists) {
			if (!exists) {
				req.writeNotFound();
			} else {
				fs.readFile( filename, "binary", function( err, file ) {
					if ( err ) {
						req.write( 500, err );
					} else {

						var mimeType = mime.lookup( filename );

						req.write( file, 200, {"Content-Type": mimeType }, "binary" );
					}
				});	
			}
		});
	};
}

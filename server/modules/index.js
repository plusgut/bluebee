exports.module = function(){
	this.main = function( cb ){
		cb();
		this.on( "/", function( req, res ){
			res.writeHead( 200, { "Content-Type": "text/plain" } );
			res.end( "Welcome to bluebee, the webdesktop :)\n" );
		});
	}
}

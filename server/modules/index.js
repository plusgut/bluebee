require( "http" );

exports.module = function(){
	this.main = function( cb ){
		cb();
		this.on( "/", function( req, res ){
			console.log( "im in teh fucking message" );
			res.writeHead( 200, { "Content-Type": "text/plain" } );
			res.end( "Hello World\n" );
		});
	}
}

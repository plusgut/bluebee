var path	= require( "path" );
var fs		= require( "fs" );
var mime	= require( "mime" );

exports.module = function(){
	this.main = function( cb ){
		cb();
	}

	this.on( "index", function( req ){
		req.writeFile( bb.path + "/client/index.html" );
	});

	this.on( "client", function( req ){
		var url = req.url.split( "?" )[ 0 ];
		url = url.split( "#" )[ 0 ] ;
		req.writeFile( bb.path + url );
	});
}

var path	= require( "path" );
var fs		= require( "fs" );

exports.module = function(){
	this.main = function( cb ){
		cb();
	}

	this.on( "index", function( req, res ){
		bb.modules.index.getFile( bb.conf.path + "/client/index.html", res );
	});

	this.on( "client", function( req, res ){
		bb.modules.index.getFile( bb.conf.path + req.url, res );
	});

	this.getFile = function( filename, res){
		path.exists(filename, function(exists) {
			if (!exists) {
				bb.core.http.writeNotFound( res )
			} else {
				fs.readFile(filename, "binary", function(err, file) {
					if (err) {
						res.writeHead(500, {"Content-Type": "text/plain"});
						res.write(err);
						res.end();
					} else { 
						res.writeHead(200);
						res.write(file, "binary");
						res.end();
					}
				});	
			}
		});
	};
}

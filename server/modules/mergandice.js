exports.module = function(){
	var fs = require( "fs" );
	this.main = function( cb ){
		cb();
	}

	this.on( "stylesheet.css", function( req ){
		var content = "";
		bb.modules.mergandice.readDir( "client", "css", null, function( path ){
			bb.log( path );
		}, function(){
			bb.log( "blub" );
		});
		req.write( "blarg" );
	});

	this.on( "javascript.js", function( req ){
		bb.modules.mergandice.readDir( "client", "js", "client/js/libs/sproutcore" ,function( path ){
			bb.log( path );
		}, function(){
			bb.log( "blub" );
		});
		req.write( "blarg" );
	});

	this.readDir = function( path, fileType, exclude, cb, finishCb ){
		fs.readdir( bb.path + "/" + path, function( err, files ){
			if( err ){
				bb.log( err, "error" );
			} else {
				files.forEach( function( file ){
					fs.stat( bb.path + "/" + path + "/" + file, function( err, stat ){
						if( err ){
							bb.log( err, "error" );
						} else {
							if( stat && stat.isDirectory() ){
								var newPath = path + "/" + file;
								if( newPath != exclude ){
									bb.modules.mergandice.readDir( newPath, fileType, exclude, cb, finishCb );
								}
							} else {
								var splittedFile = file.split( "." );
								if( splittedFile[ splittedFile.length - 1 ] == fileType ){
									cb( path + "/" + file );
								}
							}
						}
					})					
				})
			}
		})
	}
}

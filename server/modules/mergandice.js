exports.module = function(){
	var fs = require( "fs" );
	var self = this;

	this.main = function( cb ){
		cb();
	};

	this.on( "stylesheet.css", function( req ){
		self.readDir( "client", "css", null, function( results ){
			var content = "";
			var i = results.length;
			results.forEach( function( path ){
				fs.readFile( bb.path + "/" + path, "utf8", function( err, file ) {
					if ( err ) {
						bb.log( err, "error" );
					} else {
						if( i != results.length ){
							content += "\n\n";
						}
						content += "/* Content of " +path + " */\n\n";
						content += file;
					}
					if( !--i ){
						req.write( content, 200, { "Content-Type": "text/css" } );
					}
				});
			});
		});
	});

	this.readDir = function( path, fileType, exclude, cb ){
		var results = [];
		fs.readdir( bb.path + "/" + path, function( err, files ){
			if( err ){
				bb.log( err, "error" );
			} else {
				var i = files.length;
				files.forEach( function( file ){
					if( file[ 0 ] != "." ){
						fs.stat( bb.path + "/" + path + "/" + file, function( err, stat ){
							if( err ){
								bb.log( err, "error" );
							} else {
								var newPath = path + "/" + file;
								if( stat && stat.isDirectory() ){
									if( newPath != exclude ){
										self.readDir( newPath, fileType, exclude, function( res ){
											results = results.concat( res );
											if( !--i ){
												cb( results );
											}
										});
									} else { 
										if( !--i ){
											cb( results );
											}
									}
								} else {
									var splittedFile = file.split( "." );
									if( splittedFile[ splittedFile.length - 1 ] == fileType ){
										results.push( newPath );
									}
									if( !--i ){
										cb( results );
									}
								}
							}
						});
					} else {
						if( !--i ){
							cb( results );
						}
					}
				});
			}
		});
	};
};

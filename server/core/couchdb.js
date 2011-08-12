exports.module = function(){

	var http	= require( "http" );
	var fs		= require( "fs" );

	var self	= this;
	////-----------------------------------------------------------------------------------------
 	//The Constructor
	this.main = function( cb ){
		self.databaseExists( bb.conf.couchdb.database, function( err, result ){
			if( err ){
				log( "CouchDB: " + err, "error" );
			} else if ( !result ){ 
				log( "Database " + bb.conf.couchdb.database + " doesn't exist" )
			} else {
				cb();
			}
		});
	}

	////-----------------------------------------------------------------------------------------
 	//Makes the installation
	this.install = function( cb ){
		self.databaseExists( bb.conf.couchdb.database, function( err, result ){
			if( err ){
				log( "CouchDB: " + err );
				log( "Stopping installation" );
			} else {
				if( result ){
					self.readInserts( cb );
				} else {
					log( "Database " + bb.conf.couchdb.database + " doesn't exist", "prompt" );
					log( "If you fixed this, try installing installing bluebee again" );
				}
			}
		});
	}
	
	////-----------------------------------------------------------------------------------------
 	//Abstract method for checking if database is their
	this.readInserts = function( cb ){
		var user	= { id: "user0", group: 0}
		var content = null;
		fs.readFile( bb.path + "/install/couchdb.json" , "binary", function( err, file ) {
			if( err ){
				log( "CouchDB-file loading went wrong, installation stopped [" + err + "]", "error" );
				log( "CouchDB-file loading went wrong, installation stopped [" + err + "]", "prompt" );
			} else {
				try{
					content	= JSON.parse( file );
				} catch( err ) {
					log( "CouchDB-file was invalid, installation stopped  [" + err + "]", "error" );
					log( "CouchDB-file was invalid, installation stopped", "prompt" );
					return;
				}

				var length = content.length;
				for( var key in content ){
					var value = content[ key ];
					for( var type in value ){
						switch( type ){
							case "createCollection" :
								self.createCollection( value[ type ], user, 
									function( err, result ){
										if( !--length ){
											cb();
										}
									}
								);
								break;
							case "createModel" :
								if( !--length ){
									cb();
								}
								break;
							default:
								if( !--length ){
									cb();
								}
						}
					}
				}
			}
		});
	}

	////-----------------------------------------------------------------------------------------
 	//Abstract method for checking if database is their
	this.databaseExists = function( name, cb){
		self.makeRequest( name, "GET", null, function( err, res ){
			if( err ){
				cb( err, false );
			} else {
				if( res.error ){
					cb( res.error, false );
				} else {
					cb( null, true );
				}
			}
		});
	}

	////-----------------------------------------------------------------------------------------
	//Abstract method to create a collection
	this.createCollection = function( newCol , user, cb){
		var col = self.buildDocument( new this.Collection(), newCol, user );
		self.createDocument( col, function( err, res ){
			cb( err, res );
		});
	};
	////-----------------------------------------------------------------------------------------
 	//Method for creating a view (calls makeRequest
	this.createView = function( user, application, name, type, cb ){
		if( !user || !application || !name || !type ){
			cb( "incomplete" );
		} else {
			if( type == "collection" || type == "model" ){
				bb.core
				cb();
			}
		}
	};

	////-----------------------------------------------------------------------------------------
 	//Method for creating a document (calls makeRequest )
	this.createDocument = function( doc, cb ){
		self.makeRequest( bb.conf.couchdb.database, "POST", JSON.stringify( doc ), function( err, res ){
			cb( err, res );
		});	
	}
	////-----------------------------------------------------------------------------------------
 	//Makes the real requests to the database
	this.makeRequest = function( uri, method, body, cb ){
		var headers = {
			"Host": bb.conf.couchdb.host,
			"Content-Type": "application/json",
		};

		if( body ){
			headers[ "Content-Length" ] = body.length;
		}

		var options = {
			host: bb.conf.couchdb.host,
			port: bb.conf.couchdb.port,
			path: "/" + uri,
			method: method,
			headers: headers
		};

		var req = http.request(options, function(res) {
			res.setEncoding( "utf8" );
			var content = "";
			res.on( "data", function ( chunk ) {
				content += chunk;
			});

			res.on( "end", function(){
				var parsedContent = null;
				try{
					parsedContent = JSON.parse( content );
				} catch( err ){
					cb( err, content );
					return;
				}
				cb( null, parsedContent );

			});
		});

		req.on( "error", function( err ) {
			cb( err.message, null );
		});

		if( body ){
			req.write( body );
		}	
		req.end();
	}

	////-----------------------------------------------------------------------------------------
 	//Builds the new document
	this.buildDocument = function( col, newCol,user ){
		for( var colKey in newCol ){
			if( col[ colKey ] === undefined){
				if( user.id == "user0" ){
					col[ colKey ] = newCol[ colKey ];
				}
			} else {
				col[ colKey ] = newCol[ colKey ];//Finetuning is needed, for recursive changings
			}
		}
		return col;
	}

	////-----------------------------------------------------------------------------------------
 	//Default-Value for Collections
	this.Collection = function(){
		this.type = "collection",
		this.name = null,
		this.application = null
		this.user = null
		this.rights = 
			{
				users: 
					{
						user0: 
							{
								create: true,
								read: true,
								update: true,
								delete: true,
							},
					},
				groups: 
					{
						group0: 
							{
								create: true,
								read: true,
								update: true,
								delete: true,
							},
					},
				rest:
					{
						create: false,
						read: false,
						update: false,
						delete: false,
					}
			},
		subs = []
	}

	////-----------------------------------------------------------------------------------------
 	//Default-Value for Models
	this.Model = function(){
		this.type = "model",
		this.name = null,
		this.application = null,
		this.user = null,//From the collection
		this.owner = null,
		this.group = null,
		this.subs = [],
		this.content = {}
	}
};

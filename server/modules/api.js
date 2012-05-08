exports.module = function(){
        var self        = this;
	this.apiModules = [];

	////-----------------------------------------------------------------------------------------
	//The Constructor, defines what methods the api knows
	this.main = function( cb ){
		this.apiModules.createRecord = this.createRecord;
		this.apiModules.updateRecord = this.updateRecord;
		cb();
	};

	////-----------------------------------------------------------------------------------------
	//Handles the requests which are coming threw /api
	this.on( "api", function( req ){
		if( req.data && req.data.api ){
			var api;
			try{
				api = JSON.parse( req.data.api );
				this.handleApi( api, req.user, function( response, code ){
					if( code == 500 ){
						req.writeServerFailure();
					} else if( code == 401 ){
						req.writeNotAllowed();
					} else{
						try{
							req.write( JSON.stringify( response ), code );
						} catch( err ){
							bb.log( err, "error" );
							req.writeServerFailure();
						}
					}						
				});
			} catch( err ) {
				bb.log( "Parsing JSON went wrong", "error" );
				req.write( "{error: invalid request!}" );
				return;
			}

		} else if( req.data && req.data.duration && req.data.duration > 0 ){
			req.write( 500, { error: "waiting for some data.." });
			return;
		} else {
			bb.log( "uh, someone wants to use the api :)" );
			var apiDefault = { bluebee: "Oh, hi!", version: bb.version };
			req.write( JSON.stringify( apiDefault ), 200 );
			return;
		}
	});

	////-----------------------------------------------------------------------------------------
	// makes the real-handling of the methods
	this.handleApi = function( api, userHandle, cb ){
		var apiResult;
		if ( api instanceof Array ){
			apiResult	= [];
		} else {
			apiResult	= Object();
		}

		var i = 0;
		var v = 0;
		var finish = false;

		for( var apiIndex in api ){
			var type;
			var content;
			if ( api instanceof Array ){
				for( var apiType in api[ apiIndex ] ){
					type = apiType;
					content = api[ apiIndex ][ apiType ];
				}
			} else {
				type = apiIndex;
				content = api[ apiIndex ];
			}
			if( this.apiModules[ type ] ){
				this.apiModules[ type ]( content, userHandle, function( result ){
					var key	= type + "Result";
					if ( api instanceof Array ){
						var resultObject = {};
						resultObject[ key ] = result;
						apiResult.push( resultObject );
					} else {
						apiResult[ key ] = result;
					}
					v++;
					if( i == v && finish ){
						cb( apiResult, 200 );
					}
				});
			} else {
				cb( { error: "your type isn't supported"}, 200 );//ToDo better handling for not supported types
			}
			i++;
		}
		finish = true;
		if( i == v ){
			cb( apiResult, 200 );
		} 
	};

	////-----------------------------------------------------------------------------------------
	// Makes new records into the database
	this.createRecord = function( req, userHandle, cb ){
		var content	= req.content;
		var user	= req.user;
		
		var namespace	= req.model.split(".")[0];
		var eventName	= "api_create_" + namespace.toLowerCase();
		for( var moduleIndex in bb.modules ){
			var module = bb.modules[ moduleIndex ];
			var listeners   = module.listeners( eventName ).length;
			if( listeners ){
				found = true;
                                module.emit( eventName, req, userHandle, cb );
			}
		}

		if( req.model == "Bb.User" ){ //Special handling for user-model
			console.log("uh, you want to create a user? interesting..");
			if( !user ){ //Creating a user is only allowed for guests
				bb.core.user.createUser( content, userHandle, function( result, err ){
					if( err ){
						cb( { content: req.content, model: req.model, ack: false, requestKey: req.requestKey } );
					} else if( result.user ){ //Everything is fine, returns the user for continuative api-handling
						user = result.user;
						cb( { content: req.content, model: req.model, ack: true, requestKey: req.requestKey }, null, result.user );
					} else {//Something went weird
						err = "something went wrong";
						cb( { content: req.content, model: req.model, ack: false, requestKey: req.requestKey, error: err } );
					}
				});
			} else {
				cb( { content: req.content, model: req.model, ack: false, requestKey: req.requestKey } );
			}			
		} else {
			cb( { content: req.content, model: req.model, ack: true, requestKey: req.requestKey } );
		}
	};

	////-----------------------------------------------------------------------------------------
	// Updates the records
	this.updateRecord = function( req, cb ){
		cb( { content: req.content, ack: true, requestKey: req.requestKey } );
	};
};

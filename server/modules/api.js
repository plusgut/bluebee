/*   { fetch: { bucket: '', conditions: '', returnData: {} }} 
   { createRecord: { bucket: '', record: {}, returnData: {} }}
   { updateRecord: { bucket: '', key: '', record: {}, returnData: {} }}
   { deleteRecord: { bucket: '', key: '', returnData: {} }}
*/
exports.module = function(){

	this.apiModules = [];

	this.main = function( cb ){
		this.apiModules.createRecord = this.createRecord;
		this.apiModules.updateRecord = this.updateRecord;
		cb();
	};

	this.on( "api", function( req ){
		if( req.data && req.data.api ){
			var api;
			try{
				api = JSON.parse( req.data.api );
				this.handleApi( api, function( response, code ){
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

	this.handleApi = function( api, cb ){
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
					this[ type ]( content, function( result ){
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

	this.createRecord = function( req, cb ){
		cb( { content: req.content, ack: true, requestKey: req.requestKey } );
	};

	this.updateRecord = function( req, cb ){
		cb( { content: req.content, ack: true, requestKey: req.requestKey } );
	};
};

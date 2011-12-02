/*bb.DataSource = ThothSC.WebSocketDataSource.extend({
	ThothHost: 'localhost',
	ThothPort: '8080',
	ThothURLPrefix: '/api'
});*/

bb.DataSource = SC.DataSource.extend({
	url: "http://" + bb.config.server.host + ":" + bb.config.server.port + bb.config.server.apiPath,
	createRecord: function( store, storeKey, params){
		$.ajax({
			url: this.url,
			context: document.body,
			success: this.ajaxResult
		});
		var record = store.readDataHash(storeKey);
		store.dataSourceDidComplete(storeKey,record );
		return NO;
	},

	updateRecord: function( store, storeKey, params){
		var record = store.readDataHash(storeKey);
		store.dataSourceDidComplete(storeKey,record );
		return NO;
	},

	destroyRecord: function( store, storeKey, params){
		console.log( "OH NOES, its deleting itself" );
		var record = store.readDataHash(storeKey);
		//store.dataSourceDidComplete(storeKey,record );
		return NO;
	},




	ajaxResult: function( body, state, request ){
		if( request.status == 200 ){
			var response;
			try{
				response = JSON.parse( body );
				bb.log( response );
			} catch( e ){
				bb.log( e, "error" );
			}
		} else {
			bb.log( "there went something wrong" );
		}
	},

	createRecordResult: function( body, state, request ){
	}
});

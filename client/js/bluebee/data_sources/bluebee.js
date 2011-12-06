bb.socket = io.connect( "http://" + bb.config.server.host + ":" + bb.config.server.port );
bb.socket.on('s2c', function (data) {
	bb.log(data);
});

bb.DataSource = SC.DataSource.extend({
	url: "http://" + bb.config.server.host + ":" + bb.config.server.port + bb.config.server.apiPath,
	createRecord: function( store, storeKey, params){
		var record = store.readDataHash(storeKey);

		var recType = store.recordTypeFor(storeKey);

		bb.socket.emit('c2s', { createRecord: record, model: recType, storeKey: storeKey, requestKey: Math.random() } );

		store.dataSourceDidComplete(storeKey,record );
		return NO;
	},

	updateRecord: function( store, storeKey, params){
		var record = store.readDataHash(storeKey);
		bb.socket.emit('c2s', { updateRecord: record } );

		store.dataSourceDidComplete(storeKey,record );
		return NO;
	},

	destroyRecord: function( store, storeKey, params){
		console.log( "OH NOES, its deleting itself" );
		var record = store.readDataHash(storeKey);
		bb.socket.emit('c2s', { deleteRecord: record } );
		return NO;
	},
});

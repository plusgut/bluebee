App.socket = io.connect( "http://" + App.config.server.host + ":" + App.config.server.port );
App.socket.on('s2c', function (data) {
	App.log(data);
});

App.DataSource = Em.DataSource.extend({
	url: "http://" + App.config.server.host + ":" + App.config.server.port + App.config.server.apiPath,
	createRecord: function( store, storeKey, params){
		var record = store.readDataHash(storeKey);

		var recType = store.recordTypeFor(storeKey).toString();
		recType = recType.replace( "App.", "" );

		App.socket.emit('c2s', { createRecord: 	
			{ 
				content: record, 
				model: recType,
				storeKey: storeKey, 
				requestKey: Math.random()
			}
		});

		store.dataSourceDidComplete(storeKey,record );
		return NO;
	},

	updateRecord: function( store, storeKey, params){
		var record = store.readDataHash(storeKey);
		App.socket.emit('c2s', { updateRecord: record } );

		store.dataSourceDidComplete(storeKey,record );
		return NO;
	},

	destroyRecord: function( store, storeKey, params){
		App.log( "OH NOES, its deleting itself" );
		var record = store.readDataHash(storeKey);
		App.socket.emit('c2s', { deleteRecord: record } );
		return NO;
	},
});

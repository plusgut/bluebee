App.socket = io.connect( "http://" + App.config.server.host + ":" + App.config.server.port );
App.socket.on('s2c', function (data) {
	App.log(data);
});

App.adapter = DS.Adapter.create({
	url: "http://" + App.config.server.host + ":" + App.config.server.port + App.config.server.apiPath,
	createRecord: function( store, type, model){
		App.socket.emit('c2s', { createRecord:
			{
				content: model,
				model: type,
				storeKey: model.clientId,
				requestKey: Math.random()
			}
		});

		store.didCreateRecord(model, model);
	},

	updateRecord: function( store, type, model){
		store.didUpdateRecord(model, data);
	},

	deleteRecord: function( store, type, model){
		App.log( "OH NOES, its deleting itself" );
		store.didDeleteRecord(model);
	},
});

App.store = DS.Store.create({
	revision: 1,
	adapter: App.adapter,
	commitAutomatically: true,
	hashWasUpdated: function(type, clientId, record) {//Temporary fix for automatic commit
		this.updateModelArrays(type, clientId, this.get(record, 'data'));
		if (this.get('commitAutomatically')) this.commit();
	},
});



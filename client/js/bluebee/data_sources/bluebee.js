App.socket = io.connect( "http://" + App.config.server.host + ":" + App.config.server.port );
App.socket.on('s2c', function (data) {
	if( data.createRecord ){
		var content = data.createRecord;
		var model = App.getModel( content.model, window);
		App.store.createRecord( model, content.content );
	}
});

App.adapter = DS.Adapter.create({
	url: "http://" + App.config.server.host + ":" + App.config.server.port + App.config.server.apiPath,
	createRecord: function( store, type, model){
		var key = Math.random();

		if(model.get("type") != "s2c" ){
			App.socket.emit('c2s', { createRecord:
				{
					content: model,
					model: type.toString(),
					storeKey: model.clientId,
					requestKey: key
				}
			});
		}


		var modelName = type.toString().split(".");
		modelName[ modelName.length - 1 ] = modelName[ modelName.length - 1 ] + "Collection";
		modelNameString = modelName.join(".");

		var collection = App.getModel(modelNameString, window);

		if(!collection){

			collection = App.getModel(modelNameString, window, true);
			collection.set(modelName[ modelName.length - 1 ], Em.ArrayController.create({
				content: [model.toJSON()]
			}));
		} else{
			collection.content.pushObject( model.toJSON() );
		}

		store.didCreateRecord(model, model.toJSON());

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


App.getModel = function( modelString, parent, last){
	if(!modelString){
		return parent;
	}
	var modelArray = modelString.split(".");
	var model = parent[ modelArray[ 0 ] ];

	if(!model && last){
		model = parent;
	}
	var newModelArray = modelArray.slice( 1, modelArray.length );

	return App.getModel( newModelArray.join("."), model, last );
}

exports.module = function(){

	/*
	Collections:
		type: "collection",
		name: name,
		user: userId,
		group: groupId,
		rights: [ crud, crud, crud ],

	Model:
		type: "model",
		collection: collectionId,
		user: userId,
		time: timestamp,
		content: {}
	*/
	
	////-----------------------------------------------------------------------------------------
 	//The Constructor
	this.main = function( cb ){
		cb();
	}
};

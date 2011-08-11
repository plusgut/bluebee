exports.module = function(){
	
	/*How it looks like:

	Collections:
		type: "collection",
		name: "name",
		application: "system"
		user: userId,
		rights: 
			{
				users: 
					{
						userId: 
							{
								create: true,
								read: true,
								update: true,
								delete: true,
							},
						userId: 
							{
								create: true,
								read: true,
								update: true,
								delete: true,
							},
						rest:
							{
								create: false,
								read: false,
								update: false,
								delete: false,
							}
					},
				groups: 
					{
						groupId: 
							{
								create: false,
								read: false,
								update: false,
								delete: false,
							},
						groupId:
							{
								create: false,
								read: false,
								update: false,
								delete: false,
							}
					},
				rest:
					{
						create: false,
						read: false,
						update: false,
						delete: false,
					}
			},
		subs: [ userID, userID, userID ],

	Models:
		type: "model",
		name: "name",
		application: "system"
		user: userId,//From the collection
		owner: userId
		group: groupId,
		subs: [ userID, userID, userID ],
		content: {}
	*/


	////-----------------------------------------------------------------------------------------
 	//The Constructor
	this.main = function( cb ){
		cb();
	}

	this.install = function( cb ){
		log( "im installing.." );
		cb();
	}
};

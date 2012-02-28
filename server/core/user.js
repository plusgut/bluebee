exports.module = function(){
	var self	= this;
	
	////-----------------------------------------------------------------------------------------
	//The Constructor
	this.main = function( cb ){
		cb();
	};

	////-----------------------------------------------------------------------------------------
	//Creates user-model
	this.createUser = function( data, cb ){
		var err = null;
		var result = {};
		if( !data.name ){
			err = "No username";
		} else if( !data.pass ){
			err = "No pass";
		} else {
						
		}
		cb()
	};

	////-----------------------------------------------------------------------------------------
	//Authorizes the user
	this.authentificate = function( user, data, cb ){
		cb();
	};

	////-----------------------------------------------------------------------------------------
	//Encrypts the 
	this.getHash = function( data ){
		return data;
	};
};

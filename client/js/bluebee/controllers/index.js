App.Controllers.index = Em.Object.create({
	content: Em.Object.create({
		user: Em.Object.create(),
		userName: "name",
		userPass: "pass"
	}),
	
	register: function(){
		var content = this.get( "content" );
		var userName = content.get( "userName");
		var userPass = content.get( "userPass");
		if( userName && userPass ){
			var user = { name: userName, pass: userPass, owner: "root" };
			content.set( "user", App.store.createRecord( App.User, user ) );
		} else {//Invalid data
			
		}
	}
});

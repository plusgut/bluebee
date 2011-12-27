App.controllers.index = Em.Object.create({
	content: Em.Object.create({
		user: Em.Object.create(),
		userName: "name",
		userPass: "pass"
	}),
	
	register: function(){
		var content = this.get( "content" );
		App.log( content );
		var userName = content.get( "userName");
		App.log( userName );
		var userPass = content.get( "userPass");
		if( userName && userPass ){
			content.set( "user", App.store.createRecord( App.User, { name: userName , pass: userPass } ) );
		}
	}
});

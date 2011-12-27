bb.controllers.index = Em.Object.create({
	content: Em.Object.create({
		user: Em.Object.create(),
		userName: "foo",
		userPass: "bar"
	}),
	
	register: function(){
		bb.log( this.content.get( "userName") );
		var userName = this.content.get( "userName");
		var userPass = this.content.get( "userPass");
		this.content.set( "user", bb.store.createRecord( bb.User, { name: userName , pass: userPass } ) );
	}
});

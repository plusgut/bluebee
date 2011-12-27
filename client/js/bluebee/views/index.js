bb.views.index = Em.View.extend({
	userNameBinding: "bb.controllers.index.content.userName",
	userPassBinding: "bb.controllers.index.content.userPass",
	registerView: Em.View.extend({
		mouseDown: function() {
			bb.log( bb.controllers.index.content.get( "userName") );
			var userName = bb.controllers.index.content.get( "userName");
			var userPass = bb.controllers.index.content.get( "userPass");
			bb.controllers.index.content.set( "user", bb.store.createRecord( bb.User, { name: userName , pass: userPass } ) );
		}
	})
});


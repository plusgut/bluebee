App.views.index = Em.View.extend({
	userNameBinding: "App.controllers.index.content.userName",
	userPassBinding: "App.controllers.index.content.userPass",
	registerView: Em.View.extend({
		mouseDown: function() {
			App.controllers.index.register();
		}
	})
});


App.Views.index = Em.View.extend({
	userNameBinding: "App.Controllers.index.content.userName",
	userPassBinding: "App.Controllers.index.content.userPass",

	registerView: Em.View.extend({
		mouseDown: function() {
			App.Controllers.index.register();
		}
	}),
});


bb.views.index = Em.View.extend({
	userNameBinding: "bb.controllers.index.content.userName",
	userPassBinding: "bb.controllers.index.content.userPass",
	registerView: Em.View.extend({
		mouseDown: function() {
			bb.controllers.index.register();
		}
	})
});


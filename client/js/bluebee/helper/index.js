App.Helpers.index = Ember.Object.create({
	hashBinding: "App.Controllers.container.hash",
	hashIsIndex: null,

	hashChanged: function(){
		if( App.Controllers.container.get('hash') === 'index'){
			this.set("hashIsIndex", true);
		} else{
			this.set("hashIsIndex", false);
		}

	}.observes("hash")
});

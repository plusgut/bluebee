App.Views.container = Em.ContainerView.create({
	childViews: [],
	tagName: "span",
	init: function() {
		this.addView( "App", "Wait", "BlueBee is loading, please wait" );

		return this._super();
	},

	addView: function( namespace, name, template ){
		var compiledTemplate = Em.Handlebars.compile(template)
		var view = Ember.View.create( {template: compiledTemplate, tagName: "span"} );
		this.get("childViews").pushObject(view);
	}, 

	empty: function(){
		var childs = this.get("childViews")
		for( var childIndex in childs ){
			if(childs.hasOwnProperty(childIndex)){
				childs.removeObject(childs[childIndex]);
			}
		}
	}
});

App.Views.container.appendTo("#applications");

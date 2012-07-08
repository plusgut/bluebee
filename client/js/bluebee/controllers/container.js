App.Controllers.container = Em.Object.create({
	hash: "",

	init: function(){
		$(window).bind('hashchange', this.hashChange);
		this.hashChange();

		var templateContainer = {app:{index:"client/js/bluebee/templates/index.handlebars"},irc:{index:"client/js/apps/irc/templates/index.handlebars"}};//Just for testing, generation has to be made automatically
		var count = 1; //Just for testing

		var rendered = 0;
		for( var namespace in templateContainer ){
			if( templateContainer.hasOwnProperty(namespace)){
				var templates = templateContainer[ namespace ];
				for( var templateIndex in templates ){
					if(templates.hasOwnProperty(templateIndex)){
						var templatePath = templates[templateIndex];

						$.ajax({
							url: "/" + templatePath,
						}).done(function(data){
							if( rendered == 0 ){
								App.Views.container.empty()
							}
							
							App.Views.container.addView( namespace, templateIndex, data);
							
						});
					}
				}
			}
		}
	},

	hashChange: function(){
		var hash  = window.location.hash;
		if(!hash){
			hash = "index";
		} else{
			hash = hash.substring(1);
		}
		if( this.set ){//Needed because of different scopes (window and this container)
			this.set("hash", hash);

		} else{
			App.Controllers.container.set("hash", hash);
		}
	}
});

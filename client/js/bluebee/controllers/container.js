App.Controllers.container = Em.Object.create({
	init: function(){
		var templateContainer = {app:{index:"client/js/bluebee/templates/app/index.handlebars"}};//Just for testing, generation has to be made automatically
		var count = 1; //Just for testing

		var rendered = 0;
		for( var namespace in templateContainer ){
			if( templateContainer.hasOwnProperty(namespace)){
				var templates = templateContainer[ namespace ];
				for( var templateIndex in templates ){
					if(templates.hasOwnProperty(templateIndex)){
						var templatePath = templates[templateIndex];

						console.log(templatePath);
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
	}
});

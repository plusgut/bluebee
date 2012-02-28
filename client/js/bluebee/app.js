var App = Em.Application.create({
	/*store: Em.Store.create().from('App.DataSource'),*/
	title: "BlueBee - Please login"
});

App.Controllers	= {};
App.Models	= {};
App.Views	= {};

App.debug = true;

App.log = function log( content, type ){
	if( type == "error" ){
		console.log( "ERROR:" );
		console.log( content );
	} else if( App.debug ){
		console.log( content )
	}
};

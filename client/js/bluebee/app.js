var App = Em.Application.create({
	store: Em.Store.create({commitRecordsAutomatically: YES}).from('App.DataSource'),
	title: "BlueBee - Please login"
});

App.controllers	= {};
App.models	= {};
App.views	= {};

App.debug = true;

App.log = function log( content, type ){
	if( type == "error" ){
		console.log( "ERROR:" );
		console.log( content );
	} else if( App.debug ){
		console.log( content )
	}
};

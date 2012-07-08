//Ember.LOG_BINDINGS = true;

var App = Em.Application.create({
	title: "BlueBee - Please login"
});

Bb = Em.Namespace.create({
	VERSION: '0.1.0'
});

App.Controllers	= {};
App.Models	= {};
App.Helpers	= {};
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

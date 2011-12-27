var bb = Em.Application.create({
	store: Em.Store.create({commitRecordsAutomatically: YES}).from('bb.DataSource')
});

bb.controllers	= {};
bb.models	= {};
bb.views	= {};

Em.$(document).ready(function() {//I had to use this one, instead of BB.ready.. because frameworks were not loaded
});

bb.debug = true;

bb.log = function log( content, type ){
	if( type == "error" ){
		console.log( "ERROR:" );
		console.log( content );
	} else if( bb.debug ){
		console.log( content )
	}
};

var bb = Em.Application.create({
	store: Em.Store.create({commitRecordsAutomatically: YES}).from('bb.DataSource')
});

user = null;

Em.$(document).ready(function() {//I had to use this one, instead of BB.ready.. because frameworks were not loaded
	user = bb.store.createRecord( bb.User, { name: "bar" } );
});

bb.debug = true;

bb.Index = Em.View.extend({
	mouseDown: function() {
		bb.log( "ah, clicki is working" );
		user.set( "name", "blarg" );
	},
});

bb.log = function log( content, type ){
	if( type == "error" ){
		console.log( "ERROR:" );
		console.log( content );
	} else if( bb.debug ){
		console.log( content )
	}
};

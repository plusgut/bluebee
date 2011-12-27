var bb = Em.Application.create({
	store: Em.Store.create({commitRecordsAutomatically: YES}).from('bb.DataSource'),
	title: "BlueBee - Please login"
});

bb.controllers	= {};
bb.models	= {};
bb.views	= {};

bb.debug = true;

bb.log = function log( content, type ){
	if( type == "error" ){
		console.log( "ERROR:" );
		console.log( content );
	} else if( bb.debug ){
		console.log( content )
	}
};

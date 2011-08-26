var bb = SC.Application.create({
	store: SC.Store.create({commitRecordsAutomatically: YES}).from('bb.DataSource')
});


SC.$(document).ready(function() {//I had to use this one, instead of BB.ready.. because frameworks were not loaded
	var user = bb.store.createRecord( bb.User, 1 );
});

bb.debug = true;

bb.Index = SC.View.extend({
	mouseDown: function() {
		bb.log( "ah, clicki is working" );
	},
});

bb.log = function log( content ){
	if( bb.debug ){
		console.log( content )
	}
};


bb.Data = SC.Record.extend({
	title: SC.Record.attr(String),
});

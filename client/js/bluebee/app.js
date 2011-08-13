var bb = SC.Application.create();


SC.$(document).ready(function() {//I had to use this one, instead of BB.ready.. because frameworks were not loaded
	bb.DataSource = SC.DataSource.extend()
	bb.store = SC.Store.create().from('BB.DataSource');
	var data = bb.store.createRecord( bb.Data, { title: "blub"} );
	bb.store.find( SC.Query.local( bb.Data ) ).forEach( function( con ){
		console.log( con.get( "title" ) );
	});
});

bb.debug = true;

bb.Index = SC.View.extend({
	mouseDown: function() {
		BB.log( "ah, clicki is working" );
	},
});

bb.log = function log( content ){
	if( BB.debug ){
		console.log( content )
	}
};


bb.Data = SC.Record.extend({
	title: SC.Record.attr(String),
});

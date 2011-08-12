var BB = SC.Application.create();


SC.$(document).ready(function() {//I had to use this one, instead of BB.ready.. because frameworks were not loaded
	BB.DataSource = ThothSC.DataSource.extend({ThothHost:"localhost",ThothPort:"8080"})
	BB.store = SC.Store.create({ commitRecordsAutomatically: true}).from('BB.DataSource');
	BB.Data.create( { title: "blub" } );
});

BB.debug = true;

BB.Index = SC.View.extend({
	mouseDown: function() {
		BB.log( "ah, clicki is working" );
	},
});

BB.log = function log( content ){
	if( BB.debug ){
		console.log( content )
	}
};


BB.Data = SC.Record.extend({
	title: SC.Record.attr(String),
});

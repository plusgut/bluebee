var bb = SC.Application.create();


SC.$(document).ready(function() {//I had to use this one, instead of BB.ready.. because frameworks were not loaded
	BB.DataSource = ThothSC.DataSource.extend( { connectUsing: ThothSC.WEBSOCKET, ThothHost:"localhost",ThothPort:"8080", ThothURLPrefix: '/thoth'} )
//	BB.DataSource = ThothSC.WebSocketClient.extend( { ThothHost:"localhost",ThothPort:"8080", ThothURLPrefix: '/thoth'} )
	BB.store = SC.Store.create({ commitRecordsAutomatically: true}).from('BB.DataSource');
	var data = BB.store.createRecord( BB.Data, { title: "blub"} );
/*	BB.store.find( SC.Query.local( BB.Data ) ).forEach( function( con ){
		console.log( con.get( "title" ) );
	});*/
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

var BB = SC.Application.create();

BB.Index = SC.View.extend({
	mouseDown: function() {
		BB.log( "ah, clicki is working" );
	},
});

BB.debug = true;

BB.log = function log( content ){
	if( BB.debug ){
		console.log( content )
	}
};

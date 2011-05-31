var App = SC.Application.create();

App.MyView = SC.View.extend({
  mouseDown: function() {
	console.log( "ah, clicki is working" );
  }
});

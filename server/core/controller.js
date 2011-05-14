exports.module = function(){
	this.main = function(){
		console.log( "its teh fuckin main-function of this fuckin module!" );
		console.log( this.emit( "ready", "blarg") );
	}
}

exports.module = function(){
	this.main = function(){
		this.emit( "ready", "blarg");
	}
}

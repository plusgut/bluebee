/*   { fetch: { bucket: '', conditions: '', returnData: {} }} 
   { createRecord: { bucket: '', record: {}, returnData: {} }}
   { updateRecord: { bucket: '', key: '', record: {}, returnData: {} }}
   { deleteRecord: { bucket: '', key: '', returnData: {} }}
*/
exports.module = function(){
	this.main = function( cb ){
		cb();
	}

	this.on( "api", function( req, res ){
		bb.log( "uh, someone wants to use the api :)" );
		res.end();
	});

}

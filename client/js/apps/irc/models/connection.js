Irc.Connection = DS.Model.extend({
	server: DS.attr('string'),
	channel: DS.attr('string'),
	user: DS.attr('string')	
});

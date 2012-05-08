Irc = Em.Namespace.create({
        VERSION: '0.1.0'
});

Irc.Connection = DS.Model.extend({
	server: DS.attr('string'),
	channel: DS.attr('string'),
	user: DS.attr('string')	
});

Irc.Message = DS.Model.extend({
	author: DS.attr('string'),
	message: DS.attr('string'),
	channel: DS.attr('string'),
});

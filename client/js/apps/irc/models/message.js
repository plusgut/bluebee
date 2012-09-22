Irc.Message = DS.Model.extend({
	author: DS.attr('string'),
	message: DS.attr('string'),
	channel: DS.attr('string'),
});

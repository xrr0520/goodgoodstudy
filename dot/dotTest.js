// var doT = require('doT');

// dot.template(require('dot.html'))(require('dot.json'));


require(['doT', 'zepto'], function (DOT, $) {
	// body...
	var html = $('#dot').html();
	var data = {
		"itemName": "xrr123",
		"value": "abc"
	};
	
	$('body').append(DOT.template(html)(data));
});
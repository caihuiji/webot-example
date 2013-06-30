var express = require('express'),

	webot = require('weixin-robot');

	log = require('debug')('caihuiji:log'),
	
	app = express(),
	
	env = {
			token	:  process.env.WX_TOKEN || 'caihuijigood',
			route	:  process.env.ROUTE 	|| '/wechat',
			port	:  process.env.PORT		|| '80'
	};
	
	
	
	
app.use(express.cookieParser());
app.use(express.session({secret:'abcder',store: new express.session.MemoryStore()}));

webot.watch(app,{token:env.token , path:env.route});

require('./rules')(webot);

app.listen(env.port , function (){
	log("Listening on %s " , env.port);
});



var express = require('express'),

	webot = require('weixin-robot');

	
	app = express(),
	
	env = {
			token	:  process.env.WX_TOKEN || 'caihuijigood',
			route	:  process.env.ROUTE 	|| '/wechat',
			port	:  process.env.PORT		|| '3000'
	};
	
	
	
	
	
app.use(express.cookieParser());
app.use(express.session({secret:'abcder',store: new express.session.MemoryStore()}));

webot.watch(app,{token:env.token , path:env.route});

require('./rules')(webot);

app.enable('trust proxy');

app.listen(env.port , function (){
	console.log("Listening on %s " , env.port);
});



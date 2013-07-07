var express = require('express'),

	webot = require('weixin-robot');

	
	app = express(),
	
	env = {
			token	:  process.env.WX_TOKEN || 'caihuijigood',
			route	:  process.env.ROUTE 	|| '/wechat',
			port	:  process.env.PORT		|| '3000'
	};
	
app.engine('html', require('ejs').renderFile);


app.configure(function(){

	  app.set('view engine', 'ejs');
	  app.set('views', __dirname + '/views');

	 // app.use(express.logger('dev'));
	  app.use(express.bodyParser());
	  app.use(express.static(__dirname + '/public' , {maxAge: 604800000}));
	  
	  app.use(express.cookieParser());
	  app.use(express.session({secret:'abcder',store: new express.session.MemoryStore()}));

});



webot.watch(app,{token:env.token , path:env.route});

require('./src/mapping')(app);
require('./src/rules')(webot);





app.enable('trust proxy');

app.listen(env.port , function (){
	console.log("Listening on %s " , env.port);
});



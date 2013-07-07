var torrent = require("../dao/torrent"),
	_ = require("underscore")._
/**
 * 初始化路由规则
 */
module.exports = exports = function(app){
	app.get('/(index.html){0,1}', function(req, res){
		res.render('index.html');
	});
	
	app.get('/girls/:htmlname', function(req, res){
		res.render("girls/"+req.params.htmlname);
	});
	
	
	app.get('/material/dashi.html', function(req, res){
		var names = [];
		_.each(torrent.list() , function ( v ,k){
			names.push(k);
		});
		res.render("material/dashi.html" ,{
			names:names
		});
	});
	
	
	app.get('/material/heixiu.html', function(req, res){
		res.render("material/heixiu.html");
	});
	
	app.get('/material/viewImage.html', function(req, res){
		console.log(req.params.imageurl);
		res.render("material/viewImage.html" ,{
			imageurl:req.query.imageurl
		});
	});
	
	app.get('/files/zhongzi/:filename',function(req,res){
		  res.download('files/zhongzi/'+req.params.filename);
	});
	
	
	

  
}

var torrent = require("../dao/torrent"),
	_ = require("underscore")._,
	urllib = require("urllib"),
	crypto = require('crypto');
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
	
	/*@deprecated 大湿直接输出*/
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
	
	app.get('/zipai/index.html', function(req, res){
		var count = 20;
		var url = 'http://app.image.baidu.com/photos/LOGIC/toplist/get2.php?appname=beautyhuntingandroid&version=2.0.0&channelid=1426h&device=MB860&cuid=B0CB4BA0814D57BCDD5682B45E1C273D%7C934330340846353&uuid=e6dd056a-6559-4819-aa3f-f993d591d4a2&uid=2280138&startid=-1&reqno='+count+'&reqtype=latest_pic'
		urllib.request(url , function (err, data, request){
			try{
				var jsonData = JSON.parse(data.toString());
				var dataArray = _.map(jsonData.data ,function (value , key ){
					return value.image_contsign;
				});
				
				var nowTime  = (new Date().getTime()+"").substring(0,10), 
					imageUrl = 'http://timg01.baidu-1img.cn/timg?selftimerandroid_head&size=w540&quality=80&appname=selftimerandroid&sec=' + nowTime +"&";
				
				var imageArray = [];
				_.each(dataArray , function (value , key){
					var  actualImageUrl  = 'http://t10.baidu.com//it/u='+value+'&fm=17';
					var  shasum = crypto.createHash('MD5');
						 shasum.update('wisetimgkey' + nowTime + actualImageUrl);
					
				    var newImageUrl = imageUrl + '&di=' +	shasum.digest('hex') +'&src='+actualImageUrl;
					
					imageArray.push(newImageUrl);
				});
				res.render("zipai/index.html" , {imageArray:imageArray });
			}catch (e){
				res.render("zipai/index.html" , {imageArray:[] });
				console.log(e);
			}
		});
	});
	
	app.get('/material/viewImage.html', function(req, res){
		res.render("material/viewImage.html" ,{
			imageurl:req.query.imageurl
		});
	});
	
	/*@deprecated 移动到百度云盘*/
	app.get('/files/zhongzi/:filename',function(req,res){
		  res.download('files/zhongzi/'+req.params.filename);
	});
}



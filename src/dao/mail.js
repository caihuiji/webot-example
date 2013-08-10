var	 _ = require('underscore')._ ,
	 email = require('mailer'),
	 mongo = require('mongoskin'),
	 db = mongo.db('42.96.138.99:27017/meirimeinv?auto_reconnect');

module.exports = mail = {
		
		insert : function (item){
			db.collection('mail').insert(item );
		},
		
		save : function (item , callback){
			db.collection('mail').save(item ,callback);
		},
		
		getMail : function (id , callback){
			db.collection('mail').findOne({uid : id},callback);
		},
		
		sendMail : function (message , callback){
			var body = '<div>' + (message.body || "这是一份测试邮件。") +'</div><br/><br/>'+
						'<div><b style="font-family: \'lucida Grande\', Verdana; line-height: 23px;"><font color="#ff0000">感谢您的关注,如果觉得不错，请推荐给你的好友吧。 </font><b/></div>'+
						'<div><a href="http://www.imama360.com/" target="_blank"><img src="/cgi-bin/viewfile?f=0C30B02BD5A828EEEF83698EAEBAC61C4738F7816CFAEC5DAEF5FFA8E6F0186E51357BBB2D5D6CE443852FD2F078F38FF92F0FBDB8D4519736A8C8AE0889E116C3FBB95FBB2AA13AC0D36232E3BE7481609A3D3C5FDCDD95E0C4D19B27436ABD&amp;mailid=ZC4304-XY6DcUg5D02zBlkIVIKaC38&amp;sid=AdImm6JeYCInQR5M" filesize="31628"></a></div>';
				email.send(
						{
					        ssl: true,
					        host : "smtp.qq.com",//发送 smtp.qq.com，接收 pop.qq.com
					        domain : "http://www.imama360.com",//可以在浏览器中输入 http://ip.qq.com/ 得到
					        to : message.to,
					        from : "每日美女 <1598175699@qq.com>",
					        subject : message.subject,
					        html: body,
					        authentication : "login",
					        username : "1598175699",
					        password : "66231709cst",
					        debug: true
					    },
					    function(err, result){
					    	callback && callback( err == null ? 200 : err  , err == null ? "邮箱发送成功." : result);
					    }
					);
			}
};




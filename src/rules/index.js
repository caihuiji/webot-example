var crypto = require('crypto'),
	fs = require('fs')
	Log = require('log'),
	log = new Log("log" , fs.createWriteStream(__dirname + '/log.log')),
	_ = require('underscore')._,
	subject = require('../dao/subject'),
	torrent = require('../dao/torrent'),
	HeixiuService  = require("../dao/heixiu"),
	ranking  = require("../dao/ranking"),
	mail  = require("../dao/mail");

/**1
 * 初始化路由规则
 */
module.exports = exports = function(webot){
	
	  var viewImage = "http://www.imama360.com/material/viewImage.html?imageurl=";
	
/**************** subscribe or unsubscribe  **********************/
	
  webot.set("subscribe" , {
	  pattern: function(info) {
		  if((info.is('event') && info.param.event === 'subscribe')   || info.text === '5'){
			  return true;
		  }
	      return false; 
	    },
	   handler: function(info){
		   log.info(info.uid +" subscribed ");
		   
	        return 	"嘿嘿~ 健康生活就要开始咯！每天睡觉前，看看美女，梦会很美哦!!\n"+
	        		"1 回复“1” - 求问大湿(种子) \n"+
	        		"2 回复“2” - 查看互动类答题模式\n"+
	        		"3 回复“3” - 查看答题TOP 10 \n"+
	        		"4 回复“4” - 自拍美女随便看 \n"+
			        "5 回复“5” - 查看说明\n"+
			        "6 回复“6” - 绑定邮箱(接收种子)";
	     }
  });
  
  webot.set("unsubscribe" , {
	  pattern: function(info) {
		  log.info(info.uid +" unsubscribed ");
	      return info.is('event') && info.param.event === 'unsubscribe' ;
	    }
  });
  
  
/**********    lashangchuanglian    or  qiangshengjianti  ***************/
  
  
 /* webot.set('lashangchuanglian', {
	  pattern : '/^(1)|(拉上窗帘)$/',
	  handler : function (info){
		  log.info(info.uid +" request text=拉上窗帘  ");
		  return [
		             {title: '大湿来告诉你', description: '大湿回复的内容为总网友期望指数最高的内容，详情查看更新列表，持续更新中...', pic: 'http://www.imama360.com/images/dashi.jpg', url: 'http://www.imama360.com/material/dashi.html'}
		          ];
	  }
  });*/
  
  webot.set('qiangshengjianti', {
	  pattern : '/^(2)|(强身健体)$/',
	  handler : function (info){
		  log.info(info.uid +" request text=强身健体  ");
		  return [
		          	{ title:'嘿咻 - 是一款互动类答题游戏',description:'让我们在游戏中欣赏美女吧。',pic: 'http://www.imama360.com/images/heixiu.jpg', url: 'http://www.imama360.com/material/heixiu.html'}
		         ];
	  }
  });
  

  
  webot.set('top', {
	  pattern : '/^3$/',
	  handler : function (info , next){
		  
		  log.info(info.uid +" request text=top");
		  
		  ranking.top(10 , function (items , total){
			  var max = 9,
			  	  content = '嘿咻"(第二季) TOP 10 \n',
			  	  size = new HeixiuService().size();
			  for(var i = 0 ;  i < items.length ; i++){
				  if(i > max){
					  break;
				  }
				  content += '第'+(i+1)+'名:' + items[i].score +"题"+
				  			( size === items[i].score ? '(通关)\n':'\n');
			  }
			  ranking.get(info.uid , function (item){
				  content += '总共有' + (100 + total) + "人玩过嘿咻。\n";
				  content += '您答对的题数：' + (item == null ? 0  : item.score) + "题。";
				  next(null ,   content);
			  });
			 
		  });
	  }
  });
  
  
  
  webot.set('4', {
	  pattern : '/^4$/',
	  handler : function (info){
		  log.info(info.uid +" request text=强身健体  ");
		  return "自拍美女随便看! \n绝对干货! \n不怕女友老婆叼你，就打开：\n http://t.cn/zQowGg7";
	  }
  });  
  
  
  
/************      答题       *************/

  
  function  generatePic (index, subject , size){
	  var description  = "";
	  
	  _.each(subject.questions,function ( value , key){
		 description += value+"\n"; 
	  });
	  return  { 
		  		title: index +'号：帅锅，觉得我咋样啊，知道我的名字吗？',
		  		description : description + '(提示:回复 “振动器” 跳过此道题;点击标题查看大图;总共'+size+'题)',
		  		pic: subject.subject.url,
		  		url:   viewImage + subject.subject.url
		  		};
  };
  
  webot.waitRule("heixiu",function (info , next ){
	  
	  log.info(info.uid +" request text="+info.text );
	  
	  var exit = false ,
	  	heixiu =  info.session.heixiu,
	  	currentDate = new Date().getTime();
	  	
	  
	  if(currentDate - heixiu.time  >= 300000){
		  log.info(info.uid +" session time out then game over" );
		  return next(null , null);
	  }
	  
	  if(currentDate - heixiu.time  >= 180000){
		  return next ( null ,"奴家我等了好久了，还是算了吧!（你被女优们嘲笑了）");
	  }
	  
	  var heixiuService = new HeixiuService(heixiu.heixiuService);
	  
	  var score = heixiu.score;
	  switch (info.text){
	  case '啊':
		  log.info(info.uid +" exit heixiu ");
		  return  next ( null ,"你已经射，不能再继续挑战了。（你被女优们嘲笑了）"); break;
	  case '振动器':
		  heixiuService.help(function (status ,obj){
			  if( status === true){
				  ++score;
				  next (null, generatePic(obj.index , obj.subject , heixiuService.size()));
			  }else {
				  next(null , "振动器已经用过了，那个女优还在那里爽。");
			  }
			  info.session.heixiu = {  time :  new Date().getTime(),  heixiuService : heixiuService , score : score} ;
			  info.rewait();
		  });
		  break;
		 
	  default:
		  heixiuService.nextSubject(info.text , function (status ,obj){
			  if( status === true){
				  next (null, generatePic(obj.index , obj.subject , heixiuService.size()));
				  ++score;
				  info.session.heixiu = {  time :  new Date().getTime(),  heixiuService : heixiuService , score : score} ;
				  info.rewait();
				  
			  }else if(status == null ){
				  info.flag = true;
				  log.info(info.uid +" win game." );
				  ++score;
				  next(null , "你NB！等着瞧，我们题库还会不断更新的。晚一点给你奖品");
			  }else if(obj.times > 0 ) {
				  next(null ,  "你还有" + obj.times + "次撸管的机会。还有"+ obj.help +"振动器可用。");
				  info.session.heixiu = {  time :  new Date().getTime(),  heixiuService : heixiuService , score : score } ;
				  info.rewait();
		  	  }else {
		  		  var failSubject = heixiuService.getFailSubject(),
		  		  	  html =  "你已经精疲力尽，还是择日再战吧。作为能坚持战斗的人，给你透露点消息:";
		  		  
		  		  _.each(failSubject , function (v,k){
		  			html += "\n 第"+ (v.index + 1) +"题的答案是："+v.correct;
		  		  })
				  next(null , html);
			  }
		  });
	  		break;
	  }
	  ranking.get(info.uid , function (item){
		  if(item == null){
			  ranking.insert({uid : info.uid , score : score});
		  }else if (item.score < score ){
			  item.score = score;
			  ranking.save(item);
		  }
	  });
	  
  });
  
  webot.set("heixiu",{
	  pattern : '/^嘿咻$/',
	  handler : function (info , next){
		 log.info(info.uid +" enter heixiu game  " );
		 var heixiuService = new HeixiuService({_userId : info.uid});
		 
		 heixiuService.startGame(function (status , obj){
			 if(status === false){
				 next ( null , "对不起，你今天已经玩过了，择日在站吧！")
				 return ;
			 }
			 
			 info.session.heixiu = {
					  time :  new Date().getTime(),
					  heixiuService : heixiuService,
					  score : 0
			  } ;
			 info.wait("heixiu");
			 next (null , generatePic(obj.index , obj.subject , heixiuService.size()));
		 });
		 
		
	  }
  });
  
  
/************      大湿       *************/ 
  
  function getDashiDetail(){
	  var newValue = _.map(torrent.list() , function(value , key){ return key}).join(" \n");
	  return newValue;
  }
  
  webot.waitRule("dashi",function (info , next){
	  
	  log.info(info.uid +" request text="+info.text );
	  
	  if(new Date().getTime() - info.session.dashi  >= 300000){
		  log.info(info.uid +" session time out " );
		  next(null , null);
		  return ;
	  }
	  
	  var exit = false ;
	  (new Date().getTime() - info.session.dashi >= 180000) && (exit =  "你想得太久了，大湿撸管去了！");
	  info.text === '谢谢大湿' &&  ( exit = "老衲已把我毕生所学的东西传授给你了，希望你发扬广大。");
	  info.text === '谢谢大师' &&  ( exit = '尼玛，是大湿! 大湿! 大湿! 滚粗。（大湿气愤地走掉）');
	  
	  if(exit){
		  log.info(info.uid +" exit mode of dashi and message = "+ exit );
		  delete info.session.dashi;
		  next(null , exit);
		  return ;
	  }
	  
	  var data = torrent.findByName(info.text) ;
	  // 搜索列表
	  if(data){
		  message =  data.url ;
		  log.info(info.uid +" answer in dashi = " + info.text );
	  } else if (/求经典/gi.test(info.text)){
		  message = '(各种经典截图的种子)  http://t.cn/zQaNS89';
	  }else if (/^6$/gi.test(info.text)){
		  webot.get('mail').handler(info,next);
		  return ;
	  } else {
		  log.info(info.uid +" can not answer in dashi = " + info.text );
		  info.flag = true;
		  next(null , "老衲愚昧，目前的存货只有这些(请输入对应的名字):\n"+getDashiDetail());
		  return ;
	  }
	  
	  info.session.dashi = new Date().getTime();
	  info.rewait();
	  
	  log.info(info.uid +" response message = "+ message );
	  
	  
	  mail.getMail(info.uid , function (err , item){
		  
		  if(item == null || item.mail === ''){
			  next(null , message + '\n你尚未绑定邮箱,绑定后地址直接发到你邮箱里,可回复"6"进行绑定。'); 
			  return ;
		  }
		  
		  if(item.today === getToday() && item.torrentTimes >= 3){
			  next(null , '对不起，每天只能获得3个种子。');
			  return ;
		  }
		  if(item.today !== getToday()){
			  item.today = getToday();
			  item.torrentTimes = 0;
			  item.verifyTimes = 0;
		  }
		  
		  item.torrentTimes ++ ;
		  mail.save(item);
		  
		  setTimeout(function (){
			  mail.sendMail ({to : item.mail , subject :  data.name + ' - 礼包' , body : '地址:<a target="_blank" href="'+data.url+'">'+data.url+'</a>' });
		  },0);
		  next(null , message + '\n已发送到您邮箱。'); 
		  
	  }) ;
	  
  })
  
  webot.set("dashi",{
	  pattern : '/^(大湿|1|拉上窗帘)$/',
	  handler : function (info){
		  log.info(info.uid +" request text=大湿  and enter the mode of dashi");
		  info.session.dashi =   new Date().getTime() ;
		  info.wait("dashi");
		  return "说出你想要的吧，老衲尽可能满足你的欲望。\n为师的存货如下(请输入对应的名字):\n" + getDashiDetail();
	  }
  });
  
  webot.set("dashi1",{
	  pattern : '/^大师$/',
	  handler : "是大湿，不是大师。你这是在侮辱我吗？"
  });
  
  
  /***   邮箱  **********/
  
  webot.waitRule("bindEmail",function (info , next ){
	  log.info(info.uid +" request text="+info.text );
		  
		  if(new Date().getTime() - info.session.email.time  >= 60000){
			  log.info(info.uid +" session time out " );
			  next(null ,null );
			  return ;
		  }
		   
		  
		  if(info.text === '#' && /^[0-9a-zA-Z]+@(([0-9a-zA-Z]+)[.])+[a-z]{2,4}$/gi.test(info.session.email.email)){
			  mail.getMail (info.uid , function (err, item){
				  if(item.today === getToday() && item.verifyTimes >= 3){
					  next(null , '对不起，每天只能修改3次邮箱。');
					  return ;
				  }
				  if(item.today !== getToday()){
					  item.today = getToday();
					  item.verifyTimes = 0;
					  item.torrentTimes = 0;
				  }
				  item.mail =  info.session.email.email;
				  item.verifyTimes ++ ;
				  mail.save(item);
				  next(null , '保存成功，邮箱验证已发送到的邮箱，请注意查收。');
				  mail.sendMail({  to : item.mail , subject : '每日美女' ,  body : "验证通过。" });
				  
			  });
			  return ;
		  } if (info.text === '*') {
			  delete info.session.email;
			  next(null , "已退出。");
			  return ;
		  }
		  
		  if (!/^[0-9a-zA-Z]+@(([0-9a-zA-Z]+)[.])+[a-z]{2,4}$/gi.test(info.text)){
			  next(null , '您输入的邮箱地址有误，如：meirimeinv@qq.com。\n请重新输入(回复"*"取消)：');
		  }else {
			  info.session.email.email = info.text;
			  next(null , '您输入的邮箱地址是:【'+info.text+'】。\n(回复"#"保存,回复"*"取消, ,重新直接输入)');
		  }
		  info.rewait();
		  info.session.email.time = new Date().getTime();
	  
  });
  
   webot.set("mail" , {
	  pattern:'/^6$/',
	  handler : function (info , next){
		  mail.getMail (info.uid , function (err,item){
			  var message = "" , email = '';
			  if(item == null || item.mail === ''){
				message = '您当前没有设置邮箱。\n请输入您邮箱地址(回复"*"取消):';
				
				!item && mail.insert({uid : info.uid , mail : email , verify : false  , today : getToday() , verifyTimes : 0 , torrentTimes : 0 });
			  }else {
				  message = '您当前的邮箱：【'+ item.mail +'】。\n请输入您的新邮箱地址(回复"*"取消)：';
				  email = item.mail ;
			  }
			  info.session.email = {time: new Date().getTime() , email :  email};
			  info.wait("bindEmail");
			  next(null , message);
		  })
	  }
   });
  
  
  webot.set("last",{
	  pattern : '/.*/',
	  handler : function (info){
		  log.info(info.uid +" comment a = " + info.text);
		  return "我太笨了，不能理解你的意思。\n你可以回复“1”求问大湿，也许大湿能解决你的问题。\n或则回复“5”查看说明";
	  }
  });
  
  
  function getToday (){
	  var date = new Date();
	  return [date.getFullYear() , date.getMonth() , date.getDay()].join("-");
  }
  
  
}

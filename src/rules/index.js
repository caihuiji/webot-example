var crypto = require('crypto'),
	fs = require('fs')
	Log = require('log'),
	log = new Log("log" , fs.createWriteStream(__dirname + '/log.log')),
	_ = require('underscore')._,
	subject = require('../dao/subject'),
	torrent = require('../dao/torrent'),
	HeixiuService  = require("../dao/heixiu"),
	ranking  = require("../dao/ranking"),

/**
 * 初始化路由规则
 */
module.exports = exports = function(webot){
	
	  var viewImage = "http://www.imama360.com/material/viewImage.html?imageurl=";
	
/**************** subscribe or unsubscribe  **********************/
	
  webot.set("subscribe" , {
	  pattern: function(info) {
		  if((info.is('event') && info.param.event === 'subscribe')   || info.text === '4'){
			  return true;
		  }
	      return false; 
	    },
	   handler: function(info){
		   log.info(info.uid +" subscribed ");
	        return 	"嘿嘿~ 健康生活就要开始咯！每天睡觉前，看看美女，梦会很美哦!!\n"+
	        		"1 回复“1” - 查看互动类答题模式\n"+
	        		"2 回复“2” - 查看大湿模式 \n"+
	        		"3 回复“3” - 查看答题TOP 5 \n"+
			        "4 回复“4” - 查看说明";
	     }
  });
  
  webot.set("unsubscribe" , {
	  pattern: function(info) {
		  log.info(info.uid +" unsubscribed ");
	      return info.is('event') && info.param.event === 'unsubscribe' ;
	    }
  });
  
  
/**********    lashangchuanglian    or  qiangshengjianti  ***************/
  
  
  webot.set('lashangchuanglian', {
	  pattern : '/^(1)|(拉上窗帘)$/',
	  handler : function (info){
		  log.info(info.uid +" request text=拉上窗帘  ");
		  return [
		             {title: '大湿来告诉你', description: '大湿回复的内容为总网友期望指数最高的内容，详情查看更新列表，持续更新中...', pic: 'http://www.imama360.com/images/dashi.jpg', url: 'http://www.imama360.com/material/dashi.html'}
		          ];
	  }
  });
  
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
	  handler : function (info){
		  log.info(info.uid +" request text=top");
		  var content = '"嘿咻"英雄版 TOP 5 \n',
		  	  top = ranking.top();
		  
		 // top.length < 5 && (top = [10,8,6,3,2,1] ); 
		  
		  var max = 4;
		  for(var i = 0 ;  i<top.length ; i++){
			  if(i > max){
				  break;
			  }
			  content += '第'+(i+1)+'名:'+top[i] +"题 \n";
		  }
		  
		  content += '目前已有' + top.length + "人参与。";
		  
		  return content;
	  }
  });
  
  
  
  
  
  
  
  
/************      答题       *************/
  
  

  
  function  generatePic (index, subject){
	  var description  = "";
	  
	  _.each(subject.questions,function ( value , key){
		 description += value+"\n"; 
	  });
	  return  { 
		  		title: index +'号：帅锅，觉得我咋样啊，知道我的名字吗？',
		  		description : description + '(提示:回复 “振动器” 跳过此道题)',
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
				  next (null, generatePic(obj.index , obj.subject));
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
				  next (null, generatePic(obj.index , obj.subject));
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
	  ranking.get(info.uid) < score && (ranking.add(info.uid , score));
	  
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
			 next (null , generatePic(obj.index , obj.subject));
		 });
		 
		
	  }
  });
  
  
/************      答题       *************/  
  
  webot.waitRule("dashi",function (info ){
	  
	  log.info(info.uid +" request text="+info.text );
	  
	  if(new Date().getTime() - info.session.dashi  >= 300000){
		  log.info(info.uid +" session time out " );
		  return ;
	  }
	  
	  var exit = false ;
	  (new Date().getTime() - info.session.dashi >= 180000) && (exit =  "你想得太久了，大湿撸管去了！");
	  info.text === '谢谢大湿' &&  ( exit = "老衲已把我毕生所学的东西传授给你了，希望你发扬广大。");
	  info.text === '谢谢大师' &&  ( exit = '尼玛，是大湿! 大湿! 大湿! 滚粗。（大湿气愤地走掉）');
	  
	  if(exit){
		  log.info(info.uid +" exit mode of dashi and message = "+ exit );
		  delete info.session.dashi;
		  return exit;
	  }
	  
	  var data = torrent.findByName(info.text) ;
	  // 搜索列表
	  if(data){
		  message =  data.url + "\n(友情提示：使用电脑输入链接下载。)";
		  log.info(info.uid +" answer in dashi = " + info.text );
	  } else if (/(龚玥菲)|(金瓶梅)/gi.test(info.text)){
		  message = [
		             {title:"你尽然知道这个东西，给你" ,description :"<新金瓶梅> - 2013 年上映，高清种子或则征求中。。" ,pic:'http://mmsns.qpic.cn/mmsns/PyhdkQrt6uW18P7ViaD7jmGqAIUzw5a6g7cAficYjbG5r3F9IFok0XFA/0',url:'http://mmsns.qpic.cn/mmsns/PyhdkQrt6uW18P7ViaD7jmGqAIUzw5a6g7cAficYjbG5r3F9IFok0XFA/0' },
		             {title:"第一卷：命惑篇"   ,  pic:'http://mmsns.qpic.cn/mmsns/PyhdkQrt6uVN6Cg7j3wGJb86VckFOzet4nSRzR1j7FFibwvq7g0NEicQ/0',url:'http://mp.weixin.qq.com/mp/appmsg/show?__biz=MjM5MDA2ODE2MQ==&appmsgid=10000059&itemidx=1&sign=9f59114ce6a28f9e50ae73ae4aaeddbd' },
		             {title:"第二卷：色劫篇"  ,  pic:'http://mmsns.qpic.cn/mmsns/PyhdkQrt6uVloYPpKl6sXNRWt09tLibibl0SEM3KiaOzrQicYVtbNwvoHg/0',url:'http://mp.weixin.qq.com/mp/appmsg/show?__biz=MjM5MDA2ODE2MQ==&appmsgid=10000062&itemidx=1&sign=f2e3d238fdadb7f9e5641a62658b6e08' },
		             {title:"第三卷：情乱篇"  , pic:'http://mmsns.qpic.cn/mmsns/PyhdkQrt6uW18P7ViaD7jmGqAIUzw5a6gH2F8HRib4qG1icJIbsYictvdQ/0' , url:'http://mp.weixin.qq.com/mp/appmsg/show?__biz=MjM5MDA2ODE2MQ==&appmsgid=10000088&itemidx=1&sign=dd8158b6717754350cc019c5b362bbf5'},
		             {title:"第四卷：命逝篇(完结篇)"  , pic:'http://mmsns.qpic.cn/mmsns/PyhdkQrt6uWSeR5Ap6iamXTACdEDKCQibR7LmIVNJeQcCGtuhqgUChzw/0' , url:'http://mp.weixin.qq.com/mp/appmsg/show?__biz=MjM5MDA2ODE2MQ==&appmsgid=10000091&itemidx=1&sign=69a9aa534844161bad0186f8fc0573ab'},
		             {title:"龚玥菲-经典写真"  , pic:'http://mmsns.qpic.cn/mmsns/PyhdkQrt6uWSeR5Ap6iamXTACdEDKCQibR7LmIVNJeQcCGtuhqgUChzw/0' , url:'http://www.imama360.com/girls/gongyuefei.html'}
		             ];
	  } else if (subject.contain(info.text)) {
		  message = "嗯... 这是好东西啊，你过一段时间再来找我，应该就有了。";
	  }  else {
		  log.info(info.uid +" can not answer in dashi = " + info.text );
		  info.flag = true;
		  var girl = subject.next([]);
		  message =   { title:'老衲愚昧',description : "介绍个女优给你认识吧，这个的叫"+ girl.name,pic: girl.url, url: viewImage + girl.url};
		 // message =  "你所问的东西，老衲也不知，不过老衲学习一下下次再告诉你，你还有什么问的吗？";
	  }
	  
	  info.session.dashi = new Date().getTime();
	  info.rewait();
	  
	  log.info(info.uid +" response message = "+ message );
	  
	  
	  return message; 
  })
  
  webot.set("dashi",{
	  pattern : '/^大湿$/',
	  handler : function (info){
		  log.info(info.uid +" request text=大湿  and enter the mode of dashi");
		  info.session.dashi =   new Date().getTime() ;
		  info.wait("dashi");
		  return "说出你想要的吧，老衲尽可能满足你的欲望。";
	  }
  });
  
  webot.set("dashi",{
	  pattern : '/^大师$/',
	  handler : "是大湿，不是大师。你这是在侮辱我吗？"
  });
  
  
  webot.set("help",{
	  pattern : '/^help.*$/',
	  handler : function (info){
		  log.info(info.uid +" comment help = " + info.text);
		  info.flag = true;
		  return "感谢你对我们提出的宝贵意见，希望你撸得愉快。";
	  }
  });
  
  
  /* 打分 **/
  webot.set("a",{
	  pattern : '/^a$/',
	  handler : function (info){
		  log.info(info.uid +" comment a = " + info.text);
		  info.flag = true;
		  return "感谢您的评价，您的评价是对我们最大的进步。";
	  }
  });
  
  /* 打分 **/
  webot.set("last",{
	  pattern : '/.*/',
	  handler : function (info){
		  log.info(info.uid +" comment a = " + info.text);
		  return "我太笨了，不能理解你的意思。你可以回复“1”查看大湿模式，也许大湿能解决你的问题。";
	  }
  });
  
}

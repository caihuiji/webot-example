var crypto = require('crypto'),
	debug = require('debug'),
	log = debug('caihuiji:log'),
	_ = require('underscore')._,
	subject = require('../dao/subject'),
	torrent = require('../dao/torrent');

/**
 * 初始化路由规则
 */
module.exports = exports = function(webot){
	
	

	
	
/**************** subscribe or unsubscribe  **********************/
	
  webot.set("subscribe" , {
	  pattern: function(info) {
		  log(info.sp +" subscribed at " + new Date()   );
	      return info.is('event') && info.param.event === 'subscribe' ;
	    },
	   handler: function(info){
	        return 	"嘿嘿~ 健康生活就要开始咯！每天睡觉前，看看美女，梦会很美哦!!\n"+
	        		"1 回复“强生健体” - 查看互动类答题模式。\n"+
	        		"2 回复“拉上窗帘” - 查看女优获种子取模式 。";
	     }
  });
  
  webot.set("unsubscribe" , {
	  pattern: function(info) {
		  log(info.sp +" unsubscribed at " + new Date());
	      return info.is('event') && info.param.event === 'unsubscribe' ;
	    }
  });
  
  
/**********    lashangchuanglian    or  qiangshengjianti  ***************/
  
  
  webot.set('lashangchuanglian', {
	  pattern : '/^拉上窗帘$/',
	  handler : function (info){
		  log(info.sp +" request text=拉上窗帘  at " + new Date());
		  return [
		             {title: '拉上窗帘看片咯', description: '本站收录的种子均为大湿们精心筛选和狼友们的鼎立推荐!点击进入查看收录列表', pic: 'https://raw.github.com/node-webot/webot-example/master/qrcode.jpg', url: 'https://github.com/node-webot/webot-example'}
		          ];
	  }
  });
  
  webot.set('qiangshengjianti', {
	  pattern : '/^强身健体$/',
	  handler : function (info){
		  log(info.sp +" request text=强生健体  at " + new Date());
		  return [
		          	{ title:'嘿咻 - 是一款互动类答题游戏',descriton:'本游戏重在促进狼友们认识更多的女优。',pic: 'http://i.imgur.com/ijE19.jpg', url: 'https://github.com/node-webot/weixin-robot'}
		         ];
	  }
  });
  
  
  
  
  
  
/************      答题       *************/
  
  webot.waitRule("heixiu",function (info ){
	  
	  var exit = false ,
	  	heixiu =  info.session.heixiu,
	  	answered = heixiu.answered,
	  	lastAnswered = heixiu.lastAnswered,
	  	message = '';
	  (heixiu.time - new Date().getTime() >= 180*1000) &&   (exit =  "这么久还没有勃起，还是择日再战吧。（你被女优们嘲笑了）");
	  info.text === '啊' &&   (exit = "你已经射，不能再继续挑战了。（你被女优们嘲笑了）");
	  heixiu.count < 0 && (exit = "你已经精疲力尽，还是择日再战吧。（你被女优们嘲笑了）");
	  
	  if(exit){
		  delete heixiu;
		  return exit;
	  }
	  
	  if(info.text === '振动器' ){
		  if( heixiu.save >0){
			  heixiu.save--;
			  var one =  heixiu.lastAnswered = subject.next(answered);
			  message = one && one.url;
		  }else {
			  message = "振动器已经用过了，那个女优还在那里爽。你还有" + ( --heixiu.count  ) + "次撸管的机会";
		  }
	  }else if (lastAnswered.name === info.text){
		  var one =  heixiu.lastAnswered = subject.next(answered);
		  message = one && one.url;
	  }else{
		  message = "你还有" + ( --heixiu.count  ) + "次撸管的机会。还有"+heixiu.save +"振动器在手。";
	  }
	  
	  
	  // 通关
	  if(message === false){
		  message = "恭喜你成为了撸管高手。你将被列入撸管达人排行版。"
	  }else{
		  if(heixiu.count < 0){
			  return"你已经精疲力尽，还是择日再战吧。（你被女优们嘲笑了）";
		  }
		  heixiu.time = new Date().getTime();
		  info.rewait();
	  }
	 
	  return  message;
  })
  
  webot.set("heixiu",{
	  pattern : '/^嘿咻$/',
	  handler : function (info){
		 var heixiu =  info.session.heixiu = {
				  time :  new Date().getTime() ,
				  answered : {},
				  count : 3,
				  lastAnswered : {},
				  save : 1
		  } 
		  info.wait("heixiu");
		  var one =  heixiu.lastAnswered = subject.next(heixiu.answered);
		  return one.url;
	  }
  });
  
  
/************      答题       *************/  
  
  webot.waitRule("dashi",function (info ){
	  
	  log(info.sp +" request text="+info.text+" at " + new Date() );
	  
	  var exit = false ;
	  (info.session.dashi.time - new Date().getTime() >= 180*1000) && (exit =  "你想得太久了，大湿撸管去了！");
	  info.text === '谢谢大湿' &&  ( exit = "老衲已把我毕生所学的东西传授给你了，希望你发扬广大。");
	  info.text === '谢谢大师' &&  ( exit = '尼玛，是大湿! 大湿! 大湿! 滚粗。（大湿气愤地走掉）');
	  
	  if(exit){
		  log(info.sp +" request exit mode of dashi at " + new Date() );
		  delete info.session.dashi;
		  return exit;
	  }
	  
	  var data = torrent.findByName(info.text) ;
	  // 搜索列表
	  if(data){
		  message =  data.url;
		  log(info.sp +" get torrent = " + message );
	  }else {
		  message =  "你所问的东西，老衲也不知，不过老衲学习一下下次再告诉你，你还有什么问的吗？";
	  }
	  
	  info.session.dashi = new Date().getTime();
	  info.rewait();
	  
	  
	  return message; 
  })
  
  webot.set("dashi",{
	  pattern : '/^大湿$/',
	  handler : function (info){
		  log(info.sp +" request text=大湿 at " + new Date() + " and enter the mode of dashi");
		  info.session.dashi =   new Date().getTime() ;
		  info.wait("dashi");
		  return "说出你想要的吧，老衲尽可能满足你的欲望。";
	  }
  });
  
  webot.set("dashi",{
	  pattern : '/^大师$/',
	  handler : "是大湿，不是大师。你这是在侮辱我吗？"
  });
  
  

  
}

var crypto = require('crypto'),
	fs = require('fs')
	Log = require('log'),
	log = new Log("log" , fs.createWriteStream(__dirname + '/log.log')),
	_ = require('underscore')._,
	subject = require('../dao/subject'),
	torrent = require('../dao/torrent');

/**
 * 初始化路由规则
 */
module.exports = exports = function(webot){
	
	console.log(__dirname )

	
	
/**************** subscribe or unsubscribe  **********************/
	
  webot.set("subscribe" , {
	  pattern: function(info) {
		  log.info(info.sp +" subscribed ");
	      return info.is('event') && info.param.event === 'subscribe' ;
	    },
	   handler: function(info){
	        return 	"嘿嘿~ 健康生活就要开始咯！每天睡觉前，看看美女，梦会很美哦!!\n"+
	        		"1 回复“强身健体” - 查看互动类答题模式。\n"+
	        		"2 回复“拉上窗帘” - 查看女优获种子取模式 。";
	     }
  });
  
  webot.set("unsubscribe" , {
	  pattern: function(info) {
		  log.info(info.sp +" unsubscribed ");
	      return info.is('event') && info.param.event === 'unsubscribe' ;
	    }
  });
  
  
/**********    lashangchuanglian    or  qiangshengjianti  ***************/
  
  
  webot.set('lashangchuanglian', {
	  pattern : '/^拉上窗帘$/',
	  handler : function (info){
		  log.info(info.sp +" request text=拉上窗帘  ");
		  return [
		             {title: '拉上窗帘看片咯', description: '本站收录的种子均为大湿们精心筛选和狼友们的鼎立推荐!点击进入查看收录列表', pic: 'http://www.imama360.com/material/dashi.jpg', url: 'http://www.imama360.com/material/dashi.html'}
		          ];
	  }
  });
  
  webot.set('qiangshengjianti', {
	  pattern : '/^强身健体$/',
	  handler : function (info){
		  log.info(info.sp +" request text=强身健体  ");
		  return [
		          	{ title:'嘿咻 - 是一款互动类答题游戏',description:'本游戏重在促进狼友们认识更多的女优。',pic: 'http://www.imama360.com/material/heixiu.jpg', url: 'http://www.imama360.com/material/heixiu.html'}
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
	  
		  if(new Date().getTime() - heixiu.time  >= 300000){
			  log.info(info.sp +" session time out then game over"  );
			  return ;
		  }
	  
	  (new Date().getTime() - heixiu.time  >= 180000) &&   (exit =  "这么久还没有勃起，还是择日再战吧。（你被女优们嘲笑了）");
	  info.text === '啊' &&   (exit = "你已经射，不能再继续挑战了。（你被女优们嘲笑了）");
	  heixiu.count < 0 && (exit = "你已经精疲力尽，还是择日再战吧。（你被女优们嘲笑了）");
	  
	  if(exit){
		  log.info(info.sp + " exit mode of heixiu and message = " + exit );
		  delete heixiu;
		  return exit;
	  }
	  
	  if(info.text === '振动器' ){
		  if( heixiu.save >0){
			  heixiu.save--;
			  var one =  heixiu.lastAnswered = subject.next(answered);
			  message = one && { title:'你知道我是谁吗?',pic: one.url, url: one.url};
		  }else {
			  message = "振动器已经用过了，那个女优还在那里爽。你还有" + ( --heixiu.count  ) + "次撸管的机会";
		  }
	  }else if (lastAnswered.name === info.text){
		  var one =  heixiu.lastAnswered = subject.next(answered);
		  message = one && { title:'你知道我是谁吗?',pic: one.url, url: one.url};
	  }else{
		  message = "你还有" + ( --heixiu.count  ) + "次撸管的机会。还有"+heixiu.save +"振动器可用。";
	  }
	  
	  
	  // 通关
	  if(message === false){
		  info.flag = true;
		  message = "通关啦！恭喜你成为了撸管高手。你将被列入撸管达人排行版。神秘大奖稍后联系你。"
	  }else{
		  if(heixiu.count < 0){
			  log.info(info.sp + " exit mode of heixiu and message = " + "你已经精疲力尽，还是择日再战吧。（你被女优们嘲笑了）");
			  return"你已经精疲力尽，还是择日再战吧。（你被女优们嘲笑了）";
		  }
		  heixiu.time = new Date().getTime();
		  info.rewait();
	  }
	  
	  log.info(info.sp +" response message =  " + message  );
	  return  message;
  })
  
  webot.set("heixiu",{
	  pattern : '/^嘿咻$/',
	  handler : function (info){
		 log.info(info.sp +" enter heixiu game  " );
		 var heixiu =  info.session.heixiu = {
				  time :  new Date().getTime() ,
				  answered : {},
				  count : 3,
				  lastAnswered : {},
				  save : 1
		  } 
		  info.wait("heixiu");
		  var one =  heixiu.lastAnswered = subject.next(heixiu.answered);
		  return { title:'你知道我是谁吗?',pic: one.url, url: one.url};
	  }
  });
  
  
/************      答题       *************/  
  
  webot.waitRule("dashi",function (info ){
	  
	  log.info(info.sp +" request text="+info.text );
	  
	  if(new Date().getTime() - info.session.dashi.time  >= 300000){
		  log.info(info.sp +" session time out " );
		  return ;
	  }
	  
	  var exit = false ;
	  (new Date().getTime() - info.session.dashi.time >= 180000) && (exit =  "你想得太久了，大湿撸管去了！");
	  info.text === '谢谢大湿' &&  ( exit = "老衲已把我毕生所学的东西传授给你了，希望你发扬广大。");
	  info.text === '谢谢大师' &&  ( exit = '尼玛，是大湿! 大湿! 大湿! 滚粗。（大湿气愤地走掉）');
	  
	  if(exit){
		  log.info(info.sp +" exit mode of dashi and message = "+ exit );
		  delete info.session.dashi;
		  return exit;
	  }
	  
	  var data = torrent.findByName(info.text) ;
	  // 搜索列表
	  if(data){
		  message =  data.url;
		  log.info(info.sp +" answer in dashi = " + info.text );
	  } else if (/[龚玥菲|金瓶梅]/gi.test(info.text)){
		  message = [
		             {title:"你尽然知道这个东西，给你" ,description :"<新金瓶梅> - 2013 年上映，高清种子或则征求中。。" ,pic:'http://mmsns.qpic.cn/mmsns/PyhdkQrt6uW18P7ViaD7jmGqAIUzw5a6g7cAficYjbG5r3F9IFok0XFA/0',url:'http://mmsns.qpic.cn/mmsns/PyhdkQrt6uW18P7ViaD7jmGqAIUzw5a6g7cAficYjbG5r3F9IFok0XFA/0' },
		             {title:"第一卷：命惑篇"   ,  pic:'http://mmsns.qpic.cn/mmsns/PyhdkQrt6uVN6Cg7j3wGJb86VckFOzet4nSRzR1j7FFibwvq7g0NEicQ/0',url:'http://mp.weixin.qq.com/mp/appmsg/show?__biz=MjM5MDA2ODE2MQ==&appmsgid=10000059' },
		             {title:"第二卷：色劫篇"  ,  pic:'http://mmsns.qpic.cn/mmsns/PyhdkQrt6uVloYPpKl6sXNRWt09tLibibl0SEM3KiaOzrQicYVtbNwvoHg/0',url:'http://mp.weixin.qq.com/mp/appmsg/show?__biz=MjM5MDA2ODE2MQ==&appmsgid=10000062' },
		             {title:"第三卷：情乱篇"  , pic:'http://mmsns.qpic.cn/mmsns/PyhdkQrt6uW18P7ViaD7jmGqAIUzw5a6gH2F8HRib4qG1icJIbsYictvdQ/0' , url:'http://mp.weixin.qq.com/mp/appmsg/show?__biz=MjM5MDA2ODE2MQ==&appmsgid=10000088'}
		             ];
	  } else if (subject.contain(info.text)) {
		  message = "嗯... 这是好东西啊，你过一段时间再来找我，应该就有了。";
	  } else {
		  log.info(info.sp +" can not answer in dashi = " + info.text );
		  info.flag = true;
		  var girl = subject.next([]);
		  message =   { title:'给你介绍个女优',description : "这个的叫"+ girl.name,pic: girl.url, url: girl.url};
		 // message =  "你所问的东西，老衲也不知，不过老衲学习一下下次再告诉你，你还有什么问的吗？";
	  }
	  
	  info.session.dashi = new Date().getTime();
	  info.rewait();
	  
	  log.info(info.sp +" response message = "+ message );
	  
	  
	  return message; 
  })
  
  webot.set("dashi",{
	  pattern : '/^大湿$/',
	  handler : function (info){
		  log.info(info.sp +" request text=大湿  and enter the mode of dashi");
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

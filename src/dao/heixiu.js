var _ = require('underscore')._;

var heixiu = module.exports = function (setting){
	_.extend(this ,{
		_userId : null,
		
		_maxTimes : 3,
		
		_answeredIndex : [],
		
		_confusionIndex : [],
		
		_failSubject : [],
		
		_currentQuestion : {},
		
		_help : 1,
		
		_currentIndex : -1
	
		},
		setting);
	
	
};

heixiu.prototype = {
		
		
		/**
		 * 获得所有回答错误的题目
		 */
		getFailSubject : function (){
			return this._failSubject;
		},
		
		startGame : function (callback){
			for(var i = 0 ;i<this._subjects.length ; i++){
				this._answeredIndex[i] = i;
			}
			
			for(var i = 0 ;i<this._confusionSubject.length ; i++){
				this._confusionIndex[i] = i;
			}
			
			this._exchangeIndex(this._answeredIndex);
			this._exchangeIndex(this._confusionIndex);
			
			
			this.nextSubject(null , callback);
		},
		
		/**
		 * null 通关 true 成功 false 失败
		 */
		nextSubject : function ( text ,  callback){
				// 超过回答错误
				if(this._maxTimes <= 0  ){
					callback(false , this.getModel());
					return ;
				}
				
				// 回答错误
				if(text !== null && this._currentQuestion.subject.subject.name !== text && this._currentQuestion.subject.correct !== text.toLocaleLowerCase()){
					--this._maxTimes;
					this._recordFailSuject();
					callback(false , this.getModel());
					return ;
				}
				
				// 通关
				if( (this._currentIndex + 1) >=  this._subjects.length ){
					callback(null , this.getModel());
					return ;
				}
				
				this._currentIndex ++ ;
				callback(true , this.getModel());
		},
		
		help : function (callback){
			if(this._help <= 0){
				callback(false , this.getModel());
				return ;
			}
			
			--this._help;
			this._recordFailSuject();
			this.nextSubject(null , callback);
		},
		
		totalScore: function ( callback){
			
		},
		
		getModel : function (){
			if(this._currentQuestion.index === this._currentIndex+1){
				this._currentQuestion.times = this._maxTimes;
				this._currentQuestion.help =  this._help;
				return this._currentQuestion;
			}
			
			this._currentQuestion = this._generateQuestion (this._getCurrentSubject());
			return (this._currentQuestion = {times : this._maxTimes , help :  this._help , subject :  this._currentQuestion , index : this._currentIndex+1 });
		},
		
		/**
		 * 混乱下表
		 */
		_exchangeIndex : function (array , orgCallback , newCallback){
			var temp , index  ;
			for(var i = 0 ;i < array.length ; i++){
				index =  parseInt( Math.random() * (array.length));
				temp = array[i];
				array[i] = array[index];
				array[index] = temp;
				orgCallback && orgCallback (array , i);
				newCallback && newCallback (array , index );
			}
		},
		
		
		_getCurrentSubject : function (){
			return this._subjects[this._answeredIndex[this._currentIndex]];
		},
		
		_getActuallyConfusionSubject : function (index){
			return this._confusionSubject[this._confusionIndex[index]];
		},
		
		/**
		 * 注入回答错误的模型
		 */
		_recordFailSuject : function (){
			// 为空，或则已经推入
			if(this._failSubject.length === 0 || this._failSubject[this._failSubject.length - 1].index !== this._currentIndex ){
				this._failSubject.push({index : this._currentIndex , correct :  this._currentQuestion.subject.correct + "." + this._currentQuestion.subject.subject.name});
			}
		},
		
		/**
		 * 生成问题
		 */
		_generateQuestion : function (model ){
			
			var questions = [] ,
				correct = '',
				failSubjectIndex =  parseInt( Math.random() * (this._confusionSubject.length));
			
			for(var i = 0 ; i <3; i++){
				if(failSubjectIndex > this._confusionSubject.length-1){
					failSubjectIndex = 0;
				}
				questions.push(this._getActuallyConfusionSubject(failSubjectIndex++));
			}
			questions.push(model.name);
			
			this._exchangeIndex(questions);
			
			for(var i = 0 ; i < questions.length ; i ++){
					var prefix = null;
					switch (i){
					case 0 :  prefix = "a"; break; 
					case 1 :  prefix = "b"; break;
					case 2 :  prefix = "c"; break;
					case 3 :  prefix = "d"; break;
					}
					model.name === questions[i] && (correct=prefix);
					questions[i] = prefix + "." + questions[i];
			};
			
			
			var newModel = {
					subject : model,
					correct : correct,
					questions:questions
			};
			
			return newModel;
		},
		
		
		/**
		 * 题目
		 */
		
		_subjects : [
		 	        {name :'大浦安娜' ,	url	: 'http://www.imama360.com/subject/1.jpg'},
		 	        {name :'原纱央莉' ,	url	: 'http://www.imama360.com/subject/2.jpg'},
		 	        {name :'泽井芽衣' ,	url	: 'http://www.imama360.com/subject/3.jpg'},
		 	        {name :'泷泽萝拉' ,	url	: 'http://www.imama360.com/subject/4.jpg'},
		 			{name :'樱井莉亚' ,	url	: 'http://www.imama360.com/subject/5.jpg'},
		 			{name :'雾岛奈津美' ,url	: 'http://www.imama360.com/subject/6.jpg'},
		 			{name :'柚木提娜' ,	url	: 'http://www.imama360.com/subject/7.jpg'},
		 			{name :'杉原杏璃' ,	url	: 'http://www.imama360.com/subject/8.jpg'},
		 			{name :'京香julia' ,url	: 'http://www.imama360.com/subject/9.jpg'},
		 			{name :'卯月麻衣' ,	url	: 'http://www.imama360.com/subject/10.jpg'},
		 			{name :'小泽玛利亚' ,url	: 'http://www.imama360.com/subject/11.jpg'},
		 			{name :'吉泽明步' ,	url	: 'http://www.imama360.com/subject/12.jpg'},
		 			{name :'波多野结衣' ,url	: 'http://www.imama360.com/subject/13.jpg'},
		 			{name :'松岛枫' ,	url	: 'http://www.imama360.com/subject/14.jpg'},
		 			{name :'苍井空' ,	url	: 'http://www.imama360.com/subject/15.jpg'},
		 			{name :'麻生希' ,	url	: 'http://www.imama360.com/subject/16.jpg'},
		 			{name :'濑亚美莉' ,	url	: 'http://www.imama360.com/subject/17.jpg'},
		 			{name :'饭岛爱' ,	url	: 'http://www.imama360.com/subject/18.jpg'},
		 			{name :'天海翼' ,	url	: 'http://www.imama360.com/subject/19.jpg'},
		 			{name :'长谷川萌' ,	url	: 'http://www.imama360.com/subject/20.jpg'},
		 			{name :'春咲梓美' ,	url	: 'http://www.imama360.com/subject/21.jpg'},
		 			{name :'金莎' ,	url	: 'http://i3.hunantv.com/p1/20120410/1426262183.jpg'},
		 			{name :'高圆圆' ,	url	: 'http://img4.duitang.com/uploads/item/201208/17/20120817215314_tt2eh.thumb.600_0.jpeg'},
		 			{name :'张静初' ,	url	: 'http://www.chinanews.com/yl/2011/08-17/U253P4T8D3265244F107DT20110817171709.jpg'},
		 			{name :'张柏芝' ,	url	: 'http://wowo.5d6d.com/attachment/200807/12/48581_1215854013jVkm.jpg'},
		 			{name :'郭美美' ,	url	: 'http://news.xinhuanet.com/yzyd/lady/20130712/168599959004075434321n.jpg'},
		 			{name :'Angelababy' ,	url	: 'http://www.sinaimg.cn/dy/slidenews/4_img/2009_51/168_24405_145967.jpg'},
		 			{name :'刘亦菲' ,	url	: 'http://pic.wenwen.soso.com/p/20110811/20110811152419-640520516.jpg'},
		 			{name :'古力娜扎' ,	url	: 'http://upload.ellechina.com/2012/0725/thumb_465_600_1343190998130.jpg'},
		 			{name :'张馨予' ,	url	: 'http://www.gaoan.so/upload/news/2012-9-13/201291372032b9k56.jpg'}
		 		],
		 		
		 _confusionSubject : [
  			 "秋本玲子", "秋菜里子", "凤姐", "谢娜", "宫本真美", "芙蓉姐姐", "李湘",
			"高田礼子", "林志玲", "进藤玲菜", "郑秀文", "孙俪", "井上可奈", "臼井利奈","陈乔恩", "秋元优奈",
			"如月可怜", "森下理音", "范冰冰", "吉川真奈美", "李小璐", "李小冉", "贾静雯",
			"徐若瑄", "菊池丽香", "郭羡妮", "钟欣桐", "佘诗曼", "颜丹晨", "蒋勤勤", "酒井未希", "宋佳",
			"唐嫣", "瞿颖", "陈紫函", "久保美希", "李冰冰", "若林树里", "若月树里", "李若彤", "慈禧太后",
			"刘诗诗", "北条香理", "川滨奈美","杨幂","柳岩","秦岚","郑爽","李宇春","陈妍希","李心艾"
		 ]
};
		

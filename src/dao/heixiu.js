var _ = require('underscore')._;

var heixu = module.exports = function (setting){
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

heixu.prototype = {
		
		
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
				if(text != null && this._currentQuestion.subject.subject.name !== text && this._currentQuestion.subject.correct !== text.toLocaleLowerCase()){
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
		 	       {name :'中西里菜' ,	url	: 'http://www.imama360.com/heixu/1375592077965.jpg'},
		 	        {name :'香坂百合' ,	url	: 'http://www.imama360.com/heixu/1375592078009.jpg'},
		 	        {name :'张优' ,	url	: 'http://www.imama360.com/heixu/1375592078040.jpg'},
		 	        {name :'小川亚沙美' ,url	: 'http://www.imama360.com/heixu/1375592078087.jpg'},
		 	        {name :'白咲舞' ,	url	: 'http://www.imama360.com/heixu/1375592078148.jpg'} ,
		 	        {name :'希崎杰西卡' ,url	: 'http://www.imama360.com/heixu/1375592078278.jpg'},
		 	        {name :'泷泽优奈' ,	url	: 'http://www.imama360.com/heixu/1375592078331.jpg'},
		 	        {name :'乙井' ,	url	: 'http://www.imama360.com/heixu/1375592078396.jpg'},
		 	        {name :'横山美雪' ,	url	: 'http://www.imama360.com/heixu/1375592078422.jpg'},
		 	        {name :'内海直子' ,	url	: 'http://www.imama360.com/heixu/1375592078460.jpg'},
		 	        {name :'西山希' ,	url	: 'http://www.imama360.com/heixu/1375592078509.jpg'},
		 	        {name :'美遥' ,	url	:'http://www.imama360.com/heixu/1375592078558.jpg'},
		 	        {name :'并木优' ,	url	: 'http://www.imama360.com/heixu/1375592078601.jpg'},
		 	        {name :'羽月希' ,	url	: 'http://www.imama360.com/heixu/1375592078646.jpg'},
		 	        {name :'松野唯' ,	url	: 'http://www.imama360.com/heixu/1375592078697.jpg'},
		 	        {name :'西野翔' ,	url	: 'http://www.imama360.com/heixu/1375592078728.jpg'},
		 	        {name :'椎名由奈' ,	url	: 'http://www.imama360.com/heixu/1375592078786.jpg'},
		 	        {name :'有村千佳' ,	url	: 'http://www.imama360.com/heixu/1375592078836.jpg'},
		 	        {name :'仁科百华' ,	url	: 'http://www.imama360.com/heixu/1375592078878.jpg'},
		 	        {name :'香澄乃亚日' ,url	: 'http://www.imama360.com/heixu/1375592078923.jpg'} ,
		 	        {name :'友田彩也香' ,url	: 'http://www.imama360.com/heixu/1375592078969.jpg'},
		 	        {name :'里美尤利娅' ,url	: 'http://www.imama360.com/heixu/1375592079109.jpg'},
		 	        {name :'爱沢有纱' ,	url	: 'http://www.imama360.com/heixu/1375592079304.jpg'},
		 	        {name :'雨宫琴音' ,	url	: 'http://www.imama360.com/heixu/1375592079535.jpg'},
		 	        {name :'李小冉' ,	url	: 'http://www.imama360.com/heixu/1375592079745.jpg'},
		 	        {name :'徐若瑄' ,	url	: 'http://www.imama360.com/heixu/1375592079834.jpg'},
		 	        {name :'郭碧婷' ,	url	: 'http://www.imama360.com/heixu/1375592080696.jpg'},
		 	        {name :'金泰希' ,	url	: 'http://www.imama360.com/heixu/1375592081006.jpg'},
		 	        {name :'宋慧乔' ,	url	: 'http://www.imama360.com/heixu/1375592081207.jpg'},
		 	        {name :'朴妮唛' ,	url	: 'http://www.imama360.com/heixu/1375592081557.jpg'}
		 		],
		 		
		 _confusionSubject : [
  			 "秋本玲子", "秋菜里子", "凤姐", "谢娜", "宫本真美", "芙蓉姐姐", "李湘",
			"高田礼子", "林志玲", "进藤玲菜", "郑秀文", "孙俪", "井上可奈", "臼井利奈","陈乔恩", "秋元优奈",
			"如月可怜", "森下理音", "范冰冰", "吉川真奈美", "李小璐", "贾静雯",
			 "菊池丽香", "郭羡妮", "钟欣桐", "佘诗曼", "颜丹晨", "蒋勤勤", "酒井未希", "宋佳",
			"唐嫣", "瞿颖", "陈紫函", "久保美希", "李冰冰", "若林树里", "若月树里", "李若彤", "慈禧太后",
			"刘诗诗", "北条香理", "川滨奈美","杨幂","柳岩","秦岚","郑爽","李宇春","陈妍希","李心艾",'大浦安娜',
			'原纱央莉','泽井芽衣','泷泽萝拉','樱井莉亚','雾岛奈津美','柚木提娜','杉原杏璃','卯月麻衣','小泽玛利亚',
			'吉泽明步','波多野结衣','松岛枫','苍井空','麻生希','濑亚美莉','饭岛爱','天海翼','长谷川萌','春咲梓美',
			'金莎','高圆圆','张静初','张柏芝','郭美美','刘亦菲','古力娜扎','张馨予'
		 ]
};
		

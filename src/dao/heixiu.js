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
		 	        {name :'中西里菜' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=5867a96b2f2eb938ec6d7afae56385fe/68d0835494eef01f36a9b24fe0fe9925bd317d5e.jpg'},
		 	        {name :'香坂百合' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=925e3454f01f3a295ac8d5c6a924bce3/0d56bcde9c82d158d2b5cc3b800a19d8bd3e42e0.jpg'},
		 	        {name :'张优' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=88409340828ba61edfeec827713597cc/e798903df8dcd10083d46dab728b4710b8122f4b.jpg'},
		 	        {name :'小川亚沙美' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=a036a0b27bf40ad115e4c7eb672d1151/85b1326d55fbb2fbe95bcf984f4a20a44723dcac.jpg'},
		 	        {name :'白咲舞' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=a99130ffd688d43ff0a991fa4d1fd2aa/d57ba418972bd407606844777b899e510eb30968.jpg'},
		 	        {name :'希崎杰西卡' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=82d1f26081cb39dbc1c0675ee01709a7/056cc795d143ad4b8e06d04a82025aafa50f06eb.jpg'},
		 	        {name :'泷泽优奈' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=becd0d568a13632715edc23ba18ea056/fcfb492309f790523730d6b40cf3d7ca7acbd5e9.jpg'},
		 	        {name :'乙井' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=eb1c9f932df5e0feee1889096c6134e5/40ddde58ccbf6c819b09bc62bc3eb13532fa40d9.jpg'},
		 	        {name :'横山美雪' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=3e96e2aab912c8fcb4f3f6c5cc0292b4/8d858ecb39dbb6fd1e7b75ac0924ab18962b37f3.jpg'},
		 	        {name :'内海直子' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=e50312358c5494ee87220f111df7e0e1/8a119d58d109b3de8a5f77e2ccbf6c81810a4c33.jpg'},
		 	        {name :'西山希' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=771321a2367adab43dd01b4bbbd5b36b/755e43086e061d958571a5b27bf40ad163d9cae1.jpg'},
		 	        {name :'美遥' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=04ce2da9632762d0803ea4b790ed0849/9a7c06f790529822df2cab49d7ca7bcb0b46d4f9.jpg'},
		 	        {name :'并木优' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=77831023a9014c08193b28ad3a7a025b/2b5c9e8fa0ec08facf9a8e2d59ee3d6d54fbda06.jpg'},
		 	        {name :'羽月希' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=7d4c3e67a144ad342ebf878fe0a30c08/e55e2e3fb80e7becb8889f6b2f2eb9389a506b4e.jpg'},
		 	        {name :'松野唯' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=35601784b13533faf5b6932698d2fdca/15627fcf3bc79f3dd4647ababaa1cd11738b2916.jpg'},
		 	        {name :'西野翔' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=69afd5710a46f21fc9345e5bc6256b31/f46b3b9b033b5bb5778fbb7436d3d539b700bc44.jpg'},
		 	        {name :'椎名由奈' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=8b7c05de034f78f0800b9afb49300a83/2a5c7c8da9773912c38a1eebf8198618377ae268.jpg'},
		 	        {name :'有村千佳' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=06c51ca68701a18bf0eb1247ae2e0761/a7ab05d162d9f2d3da3dbe65a9ec8a136227cce8.jpg'},
		 	        {name :'仁科百华' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=fcbcce846709c93d07f20effaf3cf8bb/4e1ad988d43f87949169cca4d21b0ef41ad53a01.jpg'},
		 	        {name :'香澄乃亚日' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=e2ef6f7e51da81cb4ee683c56267d0a4/9ef8d633c895d143e2ca63a973f082025baf075f.jpg'},
		 	        {name :'友田彩也香' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=ac4a15152edda3cc0be4b82831e83905/596aeadde71190ef91ba1e55ce1b9d16fcfa6053.jpg'},
		 	        {name :'里美尤利娅' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=45960ac4ca8065387beaa41ba7dca115/f282accc7cd98d10d76c83bb213fb80e7aec9064.jpg'},
		 	        {name :'爱沢有纱' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=94037e0dd0a20cf44690fed746084b0c/88b839d12f2eb93856d18378d5628535e4dd6f58.jpg'},
		 	        {name :'雨宫琴音' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=5a05cf533901213fcf334ed464e636f8/7bb0c11b9d16fdfa78443d64b48f8c5495ee7bf4.jpg'},
		 	        {name :'李小冉' ,	url	: 'http://g.hiphotos.baidu.com/baike/c%3DbaikeA1%2C10%2C95/sign=448bbf16e950352aa56172593a289eb3/f703738da9773912cd6335c0f8198618377adab44bedcaf6.jpg'},
		 	        {name :'徐若瑄' ,	url	: 'http://f.hiphotos.baidu.com/baike/c%3DbaikeA1%2C10%2C95/sign=ee709e6b6b600c33e47989997327344e/83025aafa40f4bfb7efec32b034f78f0f636afc37931209e.jpg'},
		 	        {name :'郭碧婷' ,	url	: 'http://static.xingzuobaike.com/image/201306/17172019684.jpg'},
		 	        {name :'金泰希' ,	url	: 'http://imgsrc.baidu.com/forum/w%3D580/sign=602276fc5d6034a829e2b889fb1249d9/f3d5b951f8198618cf7d10794bed2e738ad4e660.jpg'},
		 	        {name :'宋慧乔' ,	url	: 'http://image.baidu.com/i?tn=redirect&ipn=rdt&word=j&juid=D428A9&sign=&url=http%3A%2F%2Ftieba.baidu.com%2Fp%2F2067104451'},
		 	        {name :'朴妮唛' ,	url	: 'http://image.s1979.com/allimg/120726/397_120726114054_1.jpg'}
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
		

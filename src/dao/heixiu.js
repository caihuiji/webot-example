module.exports = heixiu = function (userId){
	this._userId = userId;
};

heixiu.prototype = {
		
		_userId,
		
		_maxTimes : 3,
		
		_answered : [],
		
		_help : 1,
		
		_getTimes  : function (){
			return this.__maxTimes;
		},
		
		_getAnswered : function (){
			return _answered;
		},
		
		_subtractTimes :  function (){
			--this._maxTimes;
		},
		
		startGame : function (callback){
			//nextSubject();
		},
		
		/**
		 * true 成功 
		 * false 失败
		 */
		nextSubject : function ( callback){
				var index  = parseInt( Math.random() * (this._subjects.length) ); 
					
					var key , i = index  ;
					do{
						key = "index_" + i ;
						if( answered[key] == null){
							answered[key] = true;
							return callback(true , this._subjects[i] );
						}
						
						i ++ ;
						if(i >= this._subjects.length){
							i = 0;
						}
						
						if(i === index){
							callback(false)
						}
						
					}while(true)
		},
		
		help : function (callback){
			if(this._help <= 0){
				callback(false);
			}
			--this._help;
			nextSubject(callback);
		},
		
		totalScore: function ( callback){
			
		},
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
		 			{name :'春咲梓美' ,	url	: 'http://www.imama360.com/subject/21.jpg'}
		 		]
};
		

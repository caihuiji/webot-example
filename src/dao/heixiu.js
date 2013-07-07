var _ = require('underscore')._;

var heixiu = module.exports = function (setting){
	_.extend(this ,{
		_userId : null,
		
		_maxTimes : 3,
		
		_answeredIndex : [],
		
		_help : 1,
		
		_currentIndex : -1,
		
		_failSubject : []
	
		},
		setting);
	
	
};

heixiu.prototype = {
		
		
		_exchange : function (array){
			var temp , index  ;
			for(var i = 0 ;i < array.length ; i++){
				index =  parseInt( Math.random() * (array.length));
				temp = array[i];
				array[i] = array[index];
				array[index] = temp;
			}
		},
		
		_getCurrentSubject : function (){
			return this._subjects[this._answeredIndex[this._currentIndex]];
		},
		
		
		getFailSubject : function (){
			return this._failSubject;
		},
		
		startGame : function (callback){
			for(var i = 0 ;i<this._subjects.length ; i++){
				this._answeredIndex[i] = i;
			}
			
			this._exchange(this._answeredIndex);
			
			this.nextSubject(null , callback);
		},
		
		/**
		 * null 通关
		 * true 成功 
		 * false 失败
		 */
		nextSubject : function ( text ,  callback){
				if(this._maxTimes <= 0  ){
					callback(false , this.getModel());
					return ;
				}
				
				
				if(text !== null && this._getCurrentSubject().name !== text){
					--this._maxTimes;
					if(this._failSubject.length ===0 || this._failSubject[this._failSubject.length - 1].index !== this._currentIndex ){
						this._failSubject.push({index : this._currentIndex , name :  this._getCurrentSubject().name});
					}
					callback(false , this.getModel());
					return ;
				}
				
				
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
			this._failSubject.push({index : this._currentIndex , name :  this._getCurrentSubject().name});
			this.nextSubject(null , callback);
		},
		
		totalScore: function ( callback){
			
		},
		
		getModel : function (){
			return {times : this._maxTimes , help :  this._help , subject :  this._getCurrentSubject() , index : this._currentIndex+1 };
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
		
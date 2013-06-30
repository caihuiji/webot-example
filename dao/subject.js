module.exports = subject = {
		
		next : function (answered){
			var index  = parseInt( Math.random() * (this._subjects.length) ); 
			
			var key , i = index  ;
			do{
				key = "index_" + i ;
				if( answered[key] == null){
					answered[key] = true;
					return this._subjects[i];
				}
				
				i ++ ;
				if(i >= this._subjects.length){
					i = 0;
				}
				
				if(i === index){
					return false;
				}
				
			}while(true)
			
		},
		
		contain : function (name){
			for(var i= 0 ; i < this._subjects.length ; i++){
				if (this._subjects[i].name === name){
					return true;
				}
			}
			return false;
		},
		
		_subjects : [
			{name :'麻生希' ,url	: 'http://www.imama360.com/girls/mashengxi.html'},
			{name :'松岛枫' ,url	: 'http://www.imama360.com/girls/songdaofeng.html'},
			{name :'苍井空' ,url	: 'http://www.imama360.com/girls/cangjingkong.html'}
		]
}
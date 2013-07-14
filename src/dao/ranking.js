var	_ = require('underscore')._ ;

module.exports = ranking = {
		
		_ranking : {},
		
		add : function (id , score){
			this._ranking[id] =  score; 
		},
		
		get : function (id){
			if (this._ranking[id] == null){
				return 0;
			}
			return this._ranking[id];
		},
		
		top : function (){
			
			var newArray = [];
			_.each(this._ranking , function (value , key){
				newArray.push(value);
			});
			return  newArray.sort(function (a,b){return a < b;});
		}
		
}
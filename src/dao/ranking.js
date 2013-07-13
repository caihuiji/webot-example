var	_ = require('underscore')._ ;

module.exports = ranking = {
		
		_top : [],
		
		_ranking : {},
		
		add : function (id , score){
			this._ranking[id] =  score; 
			
			var self = this;
			
			process.nextTick(function (){
				var newArray = [];
				_.each(self._ranking , function (value , key){
					newArray.push(value);
				});
				self._top = newArray.sort().reverse();
			});
		},
		
		get : function (id){
			if (this._ranking[id] == null){
				return 0;
			}
			return this._ranking[id];
		},
		
		top : function (){
			return this._top;
		}
		
}
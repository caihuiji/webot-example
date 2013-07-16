var	_ = require('underscore')._ ,
	 mongo = require('mongoskin'),
	 db = mongo.db('42.96.138.99:27017/meirimeinv?auto_reconnect');

module.exports = ranking = {
		
		insert : function (item){
			db.collection('ranking').insert(item );
		},
		
		save : function (item){
			db.collection('ranking').save(item);
		},
		
		get : function (id , callback){
			db.collection('ranking').findOne({uid : id},function (err, items) {
				callback(items);
			});
		},
		
		top : function (limit , callback){
			db.collection('ranking').find({},{limit:limit,sort:[['score',-1]]}).toArray(function (err, items) {
				db.collection('ranking').count(function (err , count){
					callback(items , count);
				});
			});
		}
		
}
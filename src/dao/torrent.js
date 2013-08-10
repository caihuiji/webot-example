module.exports = torrent = {
		
		findByName : function (name){
			var torrent =  this._torrents[name];
			
			if(torrent == null){
				return false;
			}
			
			return {name : name , url : torrent};
		},
		
		list : function (){
			return this._torrents;
		},
		
		_torrents : {
			'麻生希'	: 'http://t.cn/zQUZHK0',
			'松岛枫'	: 'http://t.cn/zQUZYnL',
			'波多野结衣'	: 'http://t.cn/zQUZnoo',
			'苍井空'	: 'http://t.cn/zQUZEww',
			'泷泽萝拉'	: 'http://t.cn/zQUZ854',
			'濑亚美莉'	: 'http://t.cn/zQUZgvF',
			'天海翼'	: 'http://t.cn/zQUZphT',
			'柚木提娜'	: 'http://t.cn/zQUZvNq',
			'杉原杏璃':'http://t.cn/zQaNX90',
			'龚玥菲' : 'http://t.cn/zQYAMmM',
			'张馨予' : 'http://t.cn/zQf84Ft',
			/*'求经典' : 'http://t.cn/zQaNS89'*/
		}
}
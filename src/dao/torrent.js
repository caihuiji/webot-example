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
			'麻生希'	: 'http://www.imama360.com/girls/mashengxi.html',
			'松岛枫'	: 'http://www.imama360.com/girls/songdaofeng.html',
			'波多野结衣'	: 'http://www.imama360.com/girls/boduoyejieyi.html',
			'苍井空'	: 'http://www.imama360.com/girls/cangjingkong.html',
			'泷泽萝拉'	: 'http://www.imama360.com/girls/lzll.html',
			'濑亚美莉'	: 'http://t.cn/zTmLWhE',
			'天海翼'	: 'http://t.cn/zQPIVrF'
		}
}
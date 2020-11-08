var Ranking = function(){
  this.event()
}
Ranking.prototype = {
  init: function(){},
  event: function(){
    var self = this
    mui('body').on('tap', '.tab-title-item', function(){
      var id = this.getAttribute('data-id')
      switch(id){
        case 'goods':
          mui('#rank')[0].style.display = 'none'
          mui('#goods')[0].style.display = 'block'
          self.toggleClass(mui('#tabRank')[0], 'active')
          break;
        case 'rank':
          mui('#rank')[0].style.display = 'block'
          mui('#goods')[0].style.display = 'none'
          self.toggleClass(mui('#tabGoods')[0], 'active')
          break;
        default:
          break;
      }
      self.toggleClass(this, 'active')
    })
  },
  toggleClass: function(el, csName){
    if (this.hasClass(el,csName)){
      el.className = el.className.replace(RegExp('(\\s|^)' + csName + '(\\s|$)'), ' ');
    } else {
      el.className += ' ' + csName;
    }
  },
  //判断是否有该class
	hasClass: function(el, csName) {
		return el.className.match(RegExp('(\\s|^)' + csName + '(\\s|$)'));
	},
	//添加class
	addClass: function(el, csName) {
		if(!this.hasClass(el, csName)) {
			el.className += ' ' + csName;　　　　
		}
	},
	//删除class
	delClass: function(el, csName) {
		if(this.hasClass(el, csName)) {
			el.className = el.className.replace(RegExp('(\\s|^)' + csName + '(\\s|$)'), ' ');
		}
  },
}
new Ranking()

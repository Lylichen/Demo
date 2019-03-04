exports.getUrlParam = function(name){
  var r = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var a = window.location.search.substr(1).match(r)
    if (a != null) {
      return a[2]
    }
  return null
}

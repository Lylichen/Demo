function getUrlParam(name){
  var r = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var a = window.location.search.substr(1).match(r)
    if (a != null) {
      return a[2]
    }
  return null
}
function setLocalStorage(key, val){
  if (window.localStorage) {
    window.localStorage.setItem(key, val)
  } else {
    alert('浏览器不支持')
  }
}
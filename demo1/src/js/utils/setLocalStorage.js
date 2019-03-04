module.exports = (key, val) => {
  if (window.localStorage) {
    window.localStorage.setItem(key, val)
  } else {
    alert('浏览器不支持')
  }
}

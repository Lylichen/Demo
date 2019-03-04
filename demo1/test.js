module.exports = async function(content){
  function timeout(delay) {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve("{};" + content)
          }, delay)
      })
  }
  const data = await timeout(1000)
  return data
}
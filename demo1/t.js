var test = function(display){
  return new Promise(function(resolve, reject){
    resolve(display)
  })
}
const t1 = yield test('uuuuuu')
const t2 = yield test('tttttt')
t1.then((result) => {
  console.log(result)
}).catch((err) => {
  
});
t2.then((result) => {
  console.log(result)
}).catch((err) => {
  
});
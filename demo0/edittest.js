// 测试专用文件
// var r = require('./edittools.js')
// console.log(r.result)
// function dealreg(name){
//   let reg = '\/'+ name.replace('.','\\.') +'\.*"'
//   return new RegExp(reg)
// }
// var fs = require('fs')
// fs.readFile('./t1.html','utf8', function(err, data){
//   // var reg = /\/t1\.js\?v=.*"/
//   var re = dealreg('t1.js')
//   console.log(re)
//   var a = data.match(re)
//   // var a = data.replace(re, '/t1.js?v=fheiahfurh"')
//   // var a = data.replace(/<.*\/t1\.js\?v=.*>/, '<script src="js/t1.js?v=tyutoidtrj"></script>')
//   console.log(a)
//   // fs.writeFileSync('./t1.html', a)
// })
var fs = require('fs')
// var crypto = require('crypto')
// var img_root_path = 'img'
// var path = require('path')
// var flist = [];
// var fobj = Object.create(null)
// // 获取所有图片文件
// function filesList(p){
//   var tmpfn = function(){
//     var fls = fs.readdirSync(p)
//     fls.forEach(item => {
//       let src = path.join(p, item);
//       let tmp = fs.lstatSync(src)
//       let t = tmp && tmp.isDirectory() ? 1 : tmp && tmp.isFile() ? 2 : 0;
//       switch(t){
//         case 2:
//           if(/(\.png|\.jpg|\.gif|\.jpeg)$/i.test(item)){
//             flist.push(src)
//           }
//           break;
//         case 1:console.log(tmpfn);break;
//         case 0: break;
//         default: break;
//       }
//     })
//   }
//   tmpfn(p)
// }
// filesList(img_root_path)
// console.log(flist.length)
// flist.forEach(item => {
//   let data = fs.readFileSync(item)
//   fobj[item] = crypto.createHash('md5').update(data, 'utf8').digest('hex')
// })
// console.log(fobj)
var fs = require('fs')
// var crypto = require('crypto')
// var img_root_path = 'img'
// var path = require('path')
// var flist = [];
// var fobj = Object.create(null)
// // 获取所有图片文件
// function filesList(p){
//   var tmpfn = function(){
//     var fls = fs.readdirSync(p)
//     fls.forEach(item => {
//       let src = path.join(p, item);
//       let tmp = fs.lstatSync(src)
//       let t = tmp && tmp.isDirectory() ? 1 : tmp && tmp.isFile() ? 2 : 0;
//       switch(t){
//         case 2:
//           if(/(\.png|\.jpg|\.gif|\.jpeg)$/i.test(item)){
//             flist.push(src)
//           }
//           break;
//         case 1:console.log(tmpfn);break;
//         case 0: break;
//         default: break;
//       }
//     })
//   }
//   tmpfn(p)
// }
// filesList(img_root_path)
// console.log(flist.length)
// flist.forEach(item => {
//   let data = fs.readFileSync(item)
//   fobj[item] = crypto.createHash('md5').update(data, 'utf8').digest('hex')
// })
// console.log(fobj)
// fs.readFile('./t.html', 'utf8', function(err, data){
//   if(err) console.log(err)
//   console.log(data)
//   // var a = data.match(/(\/|)img\/buy\/1\.png.*"(| )/)
//   var b = data.match(/(\/|)t\.js.*"(| )/)
//   // data = data.replace(reg['reg'], '/'+reg['name']+'?v='+reg['md5']+'"')
//   var a = data.replace(/img\/buy\/1\.png.*"(| )/g, 'img/buy/1.png?v=1234579"')
//   console.log(a)
// })
fs.readFile('t.html', 'utf8', function(err, data){
  if(err) console.log(err)
  var src = 'img/Find/cc.png'
  var s = '\\W'+src.replace('/','\/').replace('.','\.')+'(|\\?v=\.*~)'
  var re = new RegExp(s, 'g')
  // var re = /\Wimg\/Find\/cc\.png(|\?v=.*~)"/g
  console.log(re)
  var ma = data.match(re)
  console.log(ma)
})
fs.readFile('./t.html', 'utf8', function(err, data){
  if(err) console.log(err)
  console.log(data)
  // var a = data.match(/(\/|)img\/buy\/1\.png.*"(| )/)
  var b = data.match(/(\/|)t\.js.*"(| )/)
  // data = data.replace(reg['reg'], '/'+reg['name']+'?v='+reg['md5']+'"')
  var a = data.replace(/img\/buy\/1\.png.*"(| )/g, 'img/buy/1.png?v=1234579"')
  console.log(a)
})
var uncss = require('uncss')
console.log(uncss)
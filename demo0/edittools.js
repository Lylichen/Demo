/**
 * @returns 修改后的html文件
 * @description 修改html文件中js,css的版本号
 */
var fs = require('fs')
var crypto = require('crypto')
var path = require('path')
var debug = true
var md5_path = './fileList.json' // 记录js，css文件名及其MD5值(此文件内容勿随意删除)
var js_root_path = './dist/js'  //存放js文件的根目录
var css_root_path = './css' // 存放css文件的根目录
var html_root_path = './' // 存放html文件的根目录
var img_root_path = 'img' //存放图片资源根目录

var fileList; // 存储md5_path文件的内容
var js_files; // 存储js_root_path目录下的所有js文件列表
var css_files; // 存储css_root_path目录下的所有css文件列表
var html_files; //存储html_root_path目录下的所有html文件列表
var new_md5_json = Object.create(null); // 存储处理后的文件MD5值列表（作用：与fileList进行比较，同时更新md5_path文件）
new_md5_json['images'] = Object.create(null); // 存储处理后的图片MD5值列表
var editList; // 返回结果

// 临时测试专用
// var fobj = Object.create(null)

// 文件操作功能函数
var dealFile = {
  rFile: function(path){
    try {
      return fs.readFileSync(path, {encoding: 'utf8'})
    } catch (error) {
      console.log(error)
    }
    return ;
  },
  wFile: function(path, data){
    try {
      fs.writeFileSync(path, data)
    } catch (error) {
      console.log(error)
    }
    return ;
  },
  rDir: function(path){
    try {
      return fs.readdirSync(path)
    } catch (error) {
      console.log(error)
    }
    return;
  },
  md5File: function(data){
    return crypto.createHash('md5').update(data, 'utf8').digest('hex');
  },
  dealreg: function(name){
    let reg = '(\\/|)'+name.replace(/\//g,'\/').replace('.','\\.') + '(\\?v=(\\w){0,32}|)';
    return new RegExp(reg, 'g')
  },
  createElist:function(elist, name, type, md5){
    if(md5){
      elist[name] = Object.create(null) //创建空对象
      elist[name]['type'] = type
      elist[name]['md5'] = md5
    }
  },
  // 递归获取所有图片文件
  getPic: function(p){
    var fls = fs.readdirSync(p)
    fls.forEach(item => {
      let src = path.join(p, item);
      let tmp = fs.lstatSync(src)
      let t = tmp && tmp.isDirectory() ? 1 : tmp && tmp.isFile() ? 2 : 0;
      switch(t){
        case 2:
          if(/(\.png|\.jpg|\.gif|\.jpeg)$/i.test(item)){
            new_md5_json['images'][src] = dealFile.md5File(fs.readFileSync(src))
          }
          break;
        case 1: this.getPic(src);break;
        case 0: break;
        default: break;
      }
    })
  }
}

fileList = dealFile.rFile(md5_path) ? JSON.parse(dealFile.rFile(md5_path)) : '';
js_files = dealFile.rDir(js_root_path)
css_files = dealFile.rDir(css_root_path)
editList = Object.create(null)
dealFile.getPic(img_root_path)

// 遍历单目录所有js、css文件，获取并保存MD5值（这里可以优化：递归目录；去除压缩文件）
js_files.forEach(item => {
  if(item.indexOf('.js') > 0){
    let fname = item.split('.js')[0]
    if(!(fname in new_md5_json)){
      new_md5_json[fname] = Object.create(null)
    }
    new_md5_json[fname]['js'] = dealFile.md5File(dealFile.rFile(js_root_path+'/'+item))
  }
});
css_files.forEach(item => {
  if(item.indexOf('.css') > 0){
    let fname = item.split('.css')[0]
    if(!(fname in new_md5_json)){
      new_md5_json[fname] = Object.create(null)
    }
    new_md5_json[fname]['css'] = dealFile.md5File(dealFile.rFile(css_root_path+'/'+item))
  }
})

// 对新旧文件MD5值进行对比
var newKeys = Object.keys(new_md5_json).filter(item => {return item !== 'images'})
var flKeys = Object.keys(fileList).filter(item => {return item !== 'images'})
var newimgKeys = new_md5_json['images'] ? Object.keys(new_md5_json['images']) : [];
var flimgKeys = fileList['images'] ? Object.keys(fileList['images']) : [];
if(fileList){
  let tmp = []
  newKeys.forEach(itemobj => {
    if(itemobj in fileList){
      Object.keys(new_md5_json[itemobj]).forEach(item => {
        if(new_md5_json[itemobj][item] !== fileList[itemobj][item]){
          dealFile.createElist(editList, itemobj+'.'+item, 'edit', new_md5_json[itemobj][item])
        }
        tmp.push(itemobj + '.' + item)
      })
    }else{
      Object.keys(new_md5_json[itemobj]).forEach(item => {
        dealFile.createElist(editList, itemobj+'.'+item, 'add', new_md5_json[itemobj][item])
      })
    }
  })
  flKeys.forEach(item => {
    Object.keys(fileList[item]).forEach(i => {
      if(tmp.indexOf(item + '.' + i) < 0){
        dealFile.createElist(editList, item +'.'+i, 'del', fileList[item][i])
      }
    })
  })
  // 单独处理图片
  newimgKeys.forEach(item => {
    if(flimgKeys.indexOf(item) < 0){
      dealFile.createElist(editList, item.replace(/\\/g, '/'), 'add', new_md5_json['images'][item])
    }else{
      if(new_md5_json['images'][item] !== fileList['images'][item]){
        dealFile.createElist(editList, item.replace(/\\/g, '/'), 'edit', new_md5_json['images'][item])
      }
    }
  })
  flimgKeys.forEach(item => {
    if(item && newimgKeys.indexOf(item) < 0){
      dealFile.createElist(editList, item.replace(/\\/g, '/'), 'del', new_md5_json['images'][item])
    }
  })
}else{
  newKeys.forEach(item => {
    dealFile.createElist(editList, item+'.js', 'add', new_md5_json[item]['js'])
    dealFile.createElist(editList, item+'.css', 'add', new_md5_json[item]['css'])
  })
  newimgKeys.forEach(item => {
    dealFile.createElist(editList, item.replace(/\\/g, '/'), 'add', new_md5_json['images'][item])
  })
}
// 更新文件MD5列表并返回结果
dealFile.wFile(md5_path, JSON.stringify(new_md5_json))

// 修改相应html文件需要的参数
var keys = Object.keys(editList);
var reg_arr = (function(){
  let arr = []
  keys.forEach(item => {
    let obj = Object.create(null)
    if(editList[item]['type'] !== 'del'){
      obj['name'] = item
      obj['reg'] = dealFile.dealreg(item)
      obj['md5'] = editList[item]['md5'].substr(0, 10)
      obj['type'] = editList[item]['type']
      arr.push(obj)
    }
  })
  return arr
})()
// debug：打印重要信息
if(debug){
  console.log('***********************************************')
  console.log('----------------所有文件的MD5值-----------------')
  console.log('***********************************************')
  console.log(new_md5_json)
  console.log('***********************************************')
  console.log('-----------请确认这些文件是否更改过--------------')
  console.log('***********************************************')
  console.log(editList)
  console.log('***********************************************')
  console.log('-----------封装修改html文件所需信息--------------')
  console.log('***********************************************')
  console.log(reg_arr)
}
// 修改相应html文件
html_files = dealFile.rDir(html_root_path)
if(html_files && reg_arr.length){
  html_files.forEach(item => {
    if(item.indexOf('.html')>0){
      var data = dealFile.rFile(html_root_path + item)
      reg_arr.forEach(reg => {
        var match = data.match(reg['reg'])
        if(match){
          let restr = match[0].indexOf('?v=') > 0 ? match[0].replace(/\?v=(\w){10}/, '?v='+reg['md5']) : match[0]+'?v='+reg['md5']
          let r = new RegExp(match[0].replace(/\//g, '\\/').replace('.', '\\.').replace('?','\\?'),'g')
          data = data.replace(r, restr)
        }
      })
      dealFile.wFile(item, data)
    }
  })
}
//异步方式处理文件（有bug）
// var editList = []; // 文件更新列表
// 文件操作封装成对象
// var dealFile = {
//   md5File: function(path, filename){
//     return new Promise((resolve, reject) => {
//       fs.readFile(path, 'utf8', (err, data) => {
//         if(err) reject(err);
//         let obj = {}
//         obj[filename] = crypto.createHash('md5').update(data, 'utf8').digest('hex');
//         resolve(obj)
//       })
//     })
//   },
//   wFile: function(path, val){
//     return new Promise((resolve, reject) => {
//       fs.writeFile(path, val, function(err){
//         if(err) reject(err)
//         resolve(true)
//       })
//     })
//   },
//   rFile: function(path){
//     return new Promise((resolve, reject) => {
//       fs.readFile(path, 'utf8', (err, data) => {
//         if(err) reject(err)
//         resolve(data)
//       })
//     })
//   },
//   rDir: function(path){
//     return new Promise((resolve, reject) => {
//       fs.readdir(path, (err, flies) => {
//         if(err) reject(err)
//         resolve(flies)
//       })
//     })
//   },
//   dealall: function(arr, flist, elist){
//     return new Promise((resolve, reject) => {
//       Promise.all(arr).then(data => {
//         // 这里进行对比所有js文件的MD5值 -> 更新fileList.json -> 更新editList->暴露出去
//         var tmpjson = {}
//         data.forEach(obj => {
//           if(Object.keys(obj)[0] in flist){
//             flist[Object.keys(obj)[0]] === obj[Object.keys(obj)[0]] ? console.log('N') : elist.push(Object.keys(obj)[0])
//           }else{
//             elist.push(Object.keys(obj)[0])
//           }
//           tmpjson[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]]
//         })
//         // 返回结果： flist-> 更新文件列表数据， elist-> 有变化的所有文件名称
//         resolve({flist: JSON.stringify(tmpjson), elist: elist})
//       }).catch(message => {
//         reject(false)
//         throw message
//       })
//     })
//   }
// }
// exports.elist = function(editList){
//   return new Promise((resolve, reject) => {
//     dealFile.rFile(js_md5_path)
//     .then(data => {
//       console.log("data--")
//       console.log(data)
//       if(data){
//         fileList = JSON.parse(data.toString('utf8'))
//       }else{
//         data = {}
//       }
//     })
//     .catch(message => {
//       throw message
//     })
//     .then(data => {
//       dealFile.rDir(js_root_path)
//         .then(data => {
//           if(data.length <= 0)
//             resolve([]);
//           var tmparr = []
//           for(let i = 0; i < data.length; i++){
//             if(data[i].indexOf('.js') > 0){
//               tmparr.push(dealFile.md5File(path.join(__dirname,js_root_path,data[i]),data[i].split('.js')[0]))
//             }
//           }
//           dealFile.dealall(tmparr,fileList,editList)
//             .then(data => {
//               if('flist' in data){
//                 dealFile.wFile(js_md5_path, data.flist)
//                   .catch(message => { throw message })
//               }
//               if('elist' in data){
//                 resolve(data.elist)
//               }
//             })
//             .catch(message => {throw message})
//         })
//         .catch(message => {
//           throw message
//         })
//     })
//     .catch(message => {
//       throw message
//     })
//   })
// }

var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');

const PLUGIN_NAME = 'sethash';

function _getManifestData(file, opts) {
  var data;
  var ext = path.extname(file.path);
  if (ext === '.json') {
      var json = {};
      try {
          var content = file.contents.toString('utf8');
          if (content) {
              json = JSON.parse(content);
          }
      } catch (x) {
          this.emit('error', new PluginError(PLUGIN_NAME,  x));
          return;
      }
      data = json
  }
  return data;
}
function createRex(matches, type){
  return new Promise((resolve, reject) => {
    if(matches){
      let arr = []
      switch(type){
        case 'img':
          matches.forEach(item => {
            if(!(/\.(png|jpeg|jpg|gif|svg)/.test(item))){
              return
            }
            let f_name = item.match(new RegExp(/[^("|\.)]*\/[^\\/]*\.(png|jpeg|jpg|gif|svg)/))
            f_name = f_name ? (f_name[0][0] === '/' ? f_name[0] : '/' + f_name[0] ): null;
            if(!f_name){
              return
            }
            let regx = new RegExp(f_name.replace(/\//g, '\/').replace(/\./g, '\\.')+'(\\?v=[^"]*)?"', 'g')
            arr.push({name: f_name, reg: regx})
          })
          break;
        default:
          matches.forEach(item => {
            if(!~item.indexOf('.'+type)){
              return
            }
            let f_name = item.match(new RegExp('\\/[^\\/]*\\.'+type))
            f_name = f_name ? f_name[0] : null
            if(!f_name){
              return
            }
            let regx = new RegExp(f_name+'(\\?v=[^"]*)?"', 'g')
            arr.push({name: f_name, reg: regx})
          })
          break
      }
      resolve(arr)
    }else{
      resolve([])
    }
  })
}

function setHash(option) {
  var opts = {...option}
  var manifest  = {};
  var mutables = [];
  return through.obj(function(file, enc, cb) {
    if (!file.isNull()) {
      var mData = _getManifestData.call(this, file, opts);
      if (mData) {
          manifest = {...manifest,...mData}
      } else {
          mutables.push(file);
      }
    }
    cb();
  }, function(cb){
    let promisearr = []
    mutables.forEach(function (file){
      promisearr.push(function(){
        return new Promise((resolve, reject) => {
          if (!file.isNull()) {
            var src = file.contents.toString('utf8');
            var script = createRex(src.match(/<script[^>]*>/g), 'js')
            var style = createRex(src.match(/<link[^>]*>/g), 'css')
            var images = createRex(src.match(/<img[^>]*>/g), 'img')
            Promise.all([script, style, images]).then(function(values){
              let a = []
              values.forEach(item => {
                a = item.length>0 ? [...a,...item] : [...a];
              })
              a.forEach(item => {
                let tmp = manifest[item.name.substr(1)]
                if(tmp){
                  src = src.replace(item.reg, '/'+tmp+'"')
                }
              })
              file.contents = Buffer.from(src);
            }).catch(err => {
              console.error(err)
            })
            resolve(file)
          } else {
            reject(file);
          }
        });
      }())
    })
    Promise.all(promisearr).then(res => {
      res.forEach(item => {
        this.push(item)
      })
      cb();
    }).catch(err => {
      console.error(err)
    })
  })
}

module.exports = setHash;
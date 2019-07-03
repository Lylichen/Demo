var through = require('through2');
var gutil = require('gulp-util');
var http = require('http');

const PLUGIN_NAME = 'setdev';

function getCookie(opts){
  const env = opts.env ? opts.env : '';
  var content = opts.file.contents.toString('utf8');
  return new Promise((resolve, reject) => {
    // 不一定使用调用接口方式，可使用读取文件等其他方式
    http.get('http://127.0.0.1:3002/getCookie?env='+env, (res) => {
      const { statusCode } = res;
      var resCookie = null;
      if(statusCode === 200){
        let data = ''
        res.on('data',function(chunk){
          data += chunk
        })
        res.on('end', function(){
          let dataobj = JSON.parse(data)
          if(!dataobj.code){
            resCookie = dataobj.data
          }
          resolve({err: 0,content:content, cookie: resCookie});
        })
        res.on('error', function(){
          resolve({err: 1, msg: 'cannot read cookie', content: content});
        })
      }
    }).on('error', (e) => {
      reject({err: -1, msg: e.message});
    })
  })
}

function setDev(option) {
  var opts = {env:'',path: '',...option}
  var stream = through.obj(async function(file, enc, cb) {
    if (file.isNull()) {
			cb(null, file);
			return;
		}
		if (file.isStream()) {
			cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return;
    }
    if(file.path.indexOf(opts.path) > 0){
      await getCookie({file: file, env: opts.env}).then(res => {
        let content = ''
        if(!res.err){
          content = res.content.replace(/return {[^}]*}/, res.cookie)
          file.contents = Buffer.from(content)
        }
      }).catch(err => {
        console.log(err)
      })
    }
    this.push(file)
    cb()
  });
  return stream;
}
module.exports = setDev;
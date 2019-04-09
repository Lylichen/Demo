var fs = require('fs')
var lpath = 'E:\\gitRepository\\' //原文件夹
var rpath = 'E:\\selfRepository\\' //新文件夹
var list = []
var lnum = 0
var rnum = 0
// 递归判断连个文件大小是否一致（可能会出现复制过程中某个文件丢失）
var fstools = {
    readDir:function(path, flag){
        let res = null
        try {
            let list = fs.readdirSync(path)
            res = flag ? list : list.length
            console.log(res)
        } catch (error) {
        }
        return res
    },
    readStats : function(path){
        var stat = false
        try {
            stat = fs.statSync(path)
        } catch (error) {
            // console.error(error)
            if(path.indexOf(rpath)>=0){
                list.push(path)
            }
            stat = false
        }
        return stat
    }
}
function checkFile(lpath, rpath){
    let flist = fstools.readDir(lpath, true)
    if(!flist){
        return; 
    }
    lnum+=flist.length;
    let rlist = fstools.readDir(rpath)
    rnum+=rlist
    flist.forEach(item => {
        const path = lpath+item;
        const stats = fstools.readStats(path)
        if(!stats){return;}
        if(stats.isFile()){
            const stat = fstools.readStats(rpath+item)
            if(!stat){return;}
            if(stat.size !== stats.size){
                list.push(rpath+item)
            }
        }else{
            checkFile(path+'\\', rpath+item+'\\')
        }
    });
}
async function run(){
    await checkFile(lpath, rpath)
    console.log('==============以下列表文件复制不成功=============')
    console.log(list)
    console.log('========再次确认复制文件数量是否一致=============')
    console.log('原文件：',lnum)
    console.log('新文件：', rnum)
}
run()
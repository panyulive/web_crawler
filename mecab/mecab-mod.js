var exec     = require('child_process').exec;
var iconv    = require('iconv');
var fs       = require('fs');
var platform = require('os').platform();//OS判定

var srcText  = "メカブのテストだよーん";

var TMP_FILE = __dirname + '/__mecab_tmpfile';
var MECAB    = 'mecab';
var ENCODING = (platform.substr(0,3) == "win")? 'SHIFT_JIS':'UTF-8';

/*
function parse(text,callback){
  if (ENCODING != 'UTF-8'){
    var bud = iconv.encode(text,ENCODING);
    fs.writeFileSync(TMP_FILE,buf,"binary");
  }else{
    fs.writeFileSync(TMP_FILE,text,"UTF-8");
  }

  var cmd = [MECAB,'"'+ TMP_FILE + '"'].join(" ");

  //コマンド実行
  var opt = {encoding : 'UTF-8'};
  if (ENCODING != 'UTF-8') opt.encoding = 'binary';
  exec
  

};
 */

module.exports = function() {
  this.parse = function(text,callback){

    var encoding = this.ENCODING;
    text += "\n";

    if (encoding != 'UTF-8'){
      var buf = iconv.encode(text,encoding);
      fs.writeFileSync(this.TMP_FILE,buf,"UTF-8");
    }else{
      fs.writeFileSync(this.TMP_FILE,text,"UTF-8");
    }

    var cmd = [
      this.MECAB,
      '"' + this.TMP_FILE + '"'
    ].join(" ");

    //コマンドを実行
    var opt = {encoding: 'UTF-8'};
    if (encoding != 'UTF-8') opt.encoding = 'binary';
    exec(cmd,opt,
         function(err,stdout,stderr){
           
           if (err) return callback(err);
           var inp;
           //結果出力ファイルを元に戻す
           if (encoding != 'UTF-8'){
             iconv.skipDecode.Warning = true;
             inp = iconv.decode(stdout,encoding);
           }else{
             inp = stdout;
           }

           inp = inp.replace(/\r/g, "");
           inp = inp.replace(/\s+$/,"");

           var lines = inp.split("\n");
           var res   = lines.map(function(line){
             return line.replace('\t',',').split(',');
           });
           callback(err,res);

         });//exec(cmd,opt,function(err,stdout,stderr){})
  };


};

var client  = require('cheerio-httpcli');
var request = require('request');
var URL     = require('url');
var fs      = require('fs');
var path    = require('path');

//共通設定
var LINK_LEVEL = 3;

var TARGET_URL = "http://nodejs.jp/nodejs.org_ja/docs/v0.10/api/";
var list = {};

downloadRec(TARGET_URL,0);

function downloadRec(url,level){

  if (level >= LINK_LEVEL) return;
  if (list[url]) return;
  list[url] = true;

  var us = TARGET_URL.split("/");
  us.pop();

  var base = us.join("/");
  if (url.indexOf(base) < 0) return;

  client.fetch(url, {},function(err, $,res){
    $("a").each(function(idx){
      var href = $(this).attr('href');
      if (!href) return;

      //絶対パスを相対パスに変更
      href = URL.resolve(url,href);

      //'#'以降を無視する
      href = href.replace(/\#.+$/, ""); //#末尾の#を消す
      downloadRec(href,level + 1);
      
    });//function(idx)

    if (url.substr(url.length - 1,1) == '/'){
      url += "index.html";//インデックスの自動追加
    }
    var savepath = url.split("/").slice(2).join("/");
    checkSaveDir(savepath);
    console.log(savepath);
    
    fs.writeFileSync(savepath,$.html());
  });//client.fetch
}

function checkSaveDir(fname){

  var dir = path.dirname(fname);
  var dirlist = dir.split("/");
  var p = "";

  for (var i in dirlist){
    p += dirlist[i] + "/";
    if (!fs.existsSync(p)){
      fs.mkdirSync(p);
    }
  }
}

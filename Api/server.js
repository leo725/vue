/**
 * Created by zongchaoyang on 2017/5/5.
 */
var express=require('express');
var app =express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//暂时先用本地模拟数据
var markdata=require("./module.json")
//这里解决不同服务的跨域请求
var cors=require("cors")
app.use(cors())
var async=require('async');
var db=require("../models/Conn")

app.use(bodyParser.json());
var markdata=require("./module.json")

//获取猜你喜欢列表
app.post('/api/getfoodlists',function (req, res, next) {
  var sql="select id name,dishesname,price from sp_merchants right join sp_sale on sp_merchants.id= sp_sale.orgid WHERE `likeexponent`>1 LIMIT 0,4";
  db.select(sql,function (err,data) {
    res.end(JSON.stringify(data));
  })
});
//获取商品列表
app.post('/api/goods/getlist',function (req, res, next) {
  let Result={"Rows":[]}
  let sql="SELECT `saletype`,`sallename` FROM `sp_sale` group by `saletype`";
  db.select(sql,function (err,data) {
    if(!err){
      let _index=0
      async.map(data,function(item,callback) {
        let sql = `SELECT dishesname,id,likeexponent,price FROM sp_sale where saletype=${item.saletype}.`
        Result.Rows.push(item)
        db.select(sql, function (err, data) {
          Result.Rows[_index].item = data
          _index++
          callback(null, Result);
        })
      },function(err,results) {
        res.end(JSON.stringify(Result));
      });
    }
  })
});

//配置服务端口
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
})
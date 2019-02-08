// 비동기, 동기 프로그램

var fs = require("fs");

//Sync
console.log("program start");
var a = fs.readFileSync('data.txt', {encoding:'utf-8'});
console.log("program end");

//Async
console.log("pro st");
var b = fs.readFile('data.txt', {encoding:'utf-8'}, function(err, data){
  console.log("readFile");
  console.log(data);
})
console.log("pro end")
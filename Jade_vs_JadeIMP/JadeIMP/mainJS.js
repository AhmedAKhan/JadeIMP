var fs = require("fs");
var jadeimp = require("../../code/index.js");

var scope = { "name":"Saim" };
var htmlResult = jadeimp.render(fs.readFileSync("./main.jadeimp"), scope);

console.log(htmlResult);

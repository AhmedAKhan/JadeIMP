var fs = require("fs");
var jadeimp = require("../../code/index");

var scope = { "name":"Saim" };
var fileContent = fs.readFileSync("./main.jadeimp", "utf8");
var htmlResult = jadeimp.render(fileContent, scope);

console.log(htmlResult);

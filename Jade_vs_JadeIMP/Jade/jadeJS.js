var pug = require('pug');
var locals = {name:"Saim"};

var fn = pug.compileFile('jade.pug');
console.log(fn(locals));
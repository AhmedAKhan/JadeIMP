// var fs = require("fs");
// var normalizedPath = require("path").join(__dirname, "jadeimp");
// var jadeimp = require("../../code/index");

// function testFile(filename){
//   // load the files
//   var expectedJsonString = fs.readFileSync( path+ "tree/"+testname + ".json", 'utf8');
//   var expectedHtml = fs.readFileSync(path + "html/"+testname+".html", 'utf8');
//   var jadeCode     = fs.readFileSync(path + "jadeimp/"+testname+".jimp", 'utf8');

//   var actualJsonResponse = jadeimp.parse(jadeCode, debug);
//   var actualHtml = jadeimp.synthesis(actualJsonResponse, actualJsonResponse.scope);

//   fs.writeFileSync("./actualHtml/" +testname+".html", actualHtml, function(err){ console.log("=================done writing to file ====================" + error);  });

//   // parse the file
//   expectedJson = JSON.parse(expectedJsonString);
//   if(Array.isArray(expectedJson)) expectedJson = expectedJson[0];
// }




// fs.readdirSync(normalizedPath).forEach(testFile);

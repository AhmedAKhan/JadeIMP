var analyzer = require('./analyzer');
var synthesizer = require('./synthesizer');


/* 
 * function that will return the string, that represents the output
 */
function render(jadeString, options){
  syntaxTree = parse(jadeString);
  outputHtml = synthesis(syntaxTree, syntaxTree.scope);
  return outputHtml;
}



/*
  this function will take in the jade input and will return the parseTree
  also called analyzer
*/
function parse(jadeString, parseDebug){
  return analyzer.parse(jadeString, parseDebug);
}

/*
  this function will take a
 */
function synthesis(syntaxTree){
  return synthesizer.convert(syntaxTree);
}



/* 
 * function that will return the string, that represents the output
 */
function render(jadeString, options){
  syntaxTree = parse(jadeString);
  outputHtml = synthesis(syntaxTree, syntaxTree.scope);
  return outputHtml;
}



// make the API functions, it will only have render and compile
module.exports.parse = parse;
module.exports.synthesis = synthesis;
module.exports.render = render; // will take in the jadeimp code and return the html as a string
module.exports.compile = function(jadeimpString){
  return function(){ return render(jadeString, options);  }
}







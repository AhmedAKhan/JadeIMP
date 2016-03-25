


function render(jadeString, options){

}

/*
  this function will take in the jade input and will return the parseTree
  also called analysis
*/
function parse(jadeString){
  return {};
}


/*
  this function will take a
 */
function synthesis(syntaxTree){
  return "";
}


// make the API functions, it will only have render and compile
module.exports.parse = parse;
module.exports.synthesis = synthesis;
module.exports.render = render;
module.exports.compile = function(jadeimpString){
  return function(){ return render(jadeString, options);  }
}




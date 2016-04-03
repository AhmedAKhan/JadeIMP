/*
  @param1 syntaxTree = this will be the syntax tree
  @return = this will return the intermediate code, currently that is the html
*/
function intCodeGen(syntaxTree){
  return "";
}


/*
  @param1 intermediateCode = this will be the intermediate code that is generated from the intermediate code generation part 
  return = this will be the optimized html
*/
function codeOptimization(intermediateCode){ return intermediateCode; }


/*
  @param1 intermediateCode = This is the intermediate code
  return = the final html code that is needed after the compilation
  
  currently the intermediate code is the same as the final code, this function is still here
  to ensure that if we wanted to add a state for the code before html we could with ease
*/
function codeGeneration(intermediateCode){ return intermediateCode; }

/*

*/
function convert(syntaxTree){
  var intermediateCode = intCodeGen(syntaxTree);
  intermediateCode = codeOptimization(intermediateCode);
  return codeGeneration(intermediateCode);
}


module.exports.convert = convert;





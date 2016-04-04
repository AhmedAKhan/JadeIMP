var lexer = require("./lexer");
var parser = require("./parser");

/*
  @param1 = the source text of the jade file
  @return = returns a sequence of tokens/symbols, more information about tokens 
                is available at --REF--
*/
function lexicalAnalysis(sourceText){
  return lexer(sourceText);
}

/*
  @param1 tokens_list = this is a list of tokens that got parsed from the jade code file. 
                more information about tokens is available at -REF--
  @return = This function will return the abstract syntax tree that is produced from the tokens list
*/
function syntacticAnalysis(tokens_list){
  return parser(tokens_list);
}

/*
  @param1 syntaxTree = this is the syntax tree
  @return = a syntax tree with contextual information, in this case it is adding the information
  needed for the variables. More information is available at --REF--.
*/
function contextualAnalysis(syntaxTree){
  // finds variables and puts the ids in a list
  // and used variables in a list

  // and injects the class names
  return syntaxTree;
}

/*
  @param1 sourceText = the source text which would be the jadeimp code as a string
  @return = this will be the abstract syntax tree with contextual analysis
*/
function parse(sourceText, debug){
  if(debug) console.log("inside the parse (analyzer.nw) with the debug value of " + debug);
  var tokensList = lexicalAnalysis(sourceText);
  if(debug) console.log("got passed the lexical analysis tokensList: " + JSON.stringify(tokensList,null,2) + " \n\n");
  var ast = syntacticAnalysis(tokensList);
  if(debug){
    console.log("tree: " + JSON.stringify(ast));
    console.log("tree[scope]: " + ast["scope"]);
  }
  return contextualAnalysis(ast);
}



// this is the api of the program, the only function that should be visible from outside
// this file is parse. 
module.exports.parse = parse;


